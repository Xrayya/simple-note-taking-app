import { eq } from "drizzle-orm";
import { DrizzleQueryError } from "drizzle-orm/errors";
import type { JWTPayload } from "jose";
import postgres from "postgres";
import { db } from "../db/db";
import { refreshTokens, users } from "../db/schema";
import {
  CredentialNotFoundError,
  EmailAlreadyExistsError,
  InvalidTokenError,
} from "../exceptions/auth";
import { UnknownError } from "../exceptions/base";
import { hasher, jwt } from "../utils";

export async function register({
  email,
  username,
  password,
}: {
  email: string;
  username: string;
  password: string;
}): Promise<{ email: string; username: string; timestamp: Date }> {
  try {
    const result = await db
      .insert(users)
      .values({
        email,
        username,
        passwordHash: hasher.encrypt(password),
      })
      .returning({
        email: users.email,
        username: users.username,
        timestamp: users.createdAt,
      });

    return result[0]!;
  } catch (error) {
    if (!(error instanceof DrizzleQueryError)) {
      throw new UnknownError(
        "An unexpected error occurred during registration.",
      );
    }

    if (!(error.cause instanceof postgres.PostgresError)) {
      throw new UnknownError(
        "An unexpected error occurred during registration.",
      );
    }

    if (
      error.cause.code === "23505" &&
      error.cause.constraint_name?.includes("email")
    ) {
      throw new EmailAlreadyExistsError(email);
    } else {
      throw new UnknownError(
        "An unexpected error occurred during registration.",
      );
    }
  }
}

export async function login({
  usernameOrEmail,
  password,
}: {
  usernameOrEmail: string;
  password: string;
}): Promise<{ userId: string; username: string; email: string }> {
  const user = await db.query.users.findFirst({
    where: {
      OR: [
        { username: { eq: usernameOrEmail } },
        { email: { eq: usernameOrEmail } },
      ],
    },
  });

  if (!user) {
    throw new CredentialNotFoundError();
  }

  const isPasswordValid = hasher.verify(user.passwordHash, password);

  if (!isPasswordValid) {
    throw new CredentialNotFoundError();
  }

  return {
    userId: user.id,
    username: user.username,
    email: user.email,
  };
}

export async function createToken({
  userId,
  username,
  userEmail,
  expiresIn,
}: {
  userId: string;
  username: string;
  userEmail: string;
  userRole: string;
  deviceId: string;
  expiresIn: number;
}): Promise<{ refreshToken: string; accessToken: string }> {
  // WARN: Potential exception
  const result = await db
    .insert(refreshTokens)
    .values({
      ownerId: userId,
      expiredAt: new Date(Date.now() + expiresIn * 1000),
    })
    .returning({
      refreshToken: refreshTokens.token,
    });

  const payload = {
    userId,
    username,
    email: userEmail,
  };

  const accessToken = await jwt.sign(payload);

  return { refreshToken: result[0]!.refreshToken, accessToken };
}

export async function refreshAccessToken({
  refreshToken,
}: {
  refreshToken: string;
}): Promise<string> {
  const result = await db.query.refreshTokens.findFirst({
    columns: {},
    where: {
      token: { eq: refreshToken },
    },
    with: {
      owner: {
        columns: {
          id: true,
          username: true,
          email: true,
        },
      },
    },
  });

  if (!result) {
    throw new InvalidTokenError();
  }

  const payload = {
    userId: result.owner.id,
    username: result.owner.username,
    email: result.owner.email,
  };

  const accessToken = await jwt.sign(payload);

  return accessToken;
}

export async function logout({
  refreshToken,
}: {
  refreshToken: string;
}): Promise<void> {
  const result = await db
    .delete(refreshTokens)
    .where(eq(refreshTokens.token, refreshToken))
    .returning({
      id: refreshTokens.id,
    });

  if (result.length === 0) {
    throw new InvalidTokenError();
  }
}

export async function getAuthInfo({
  accessToken,
}: {
  accessToken: string;
}): Promise<{ username: string; email: string }> {
  const { userId } = (await jwt.verify(accessToken)) as JWTPayload & {
    userId: string;
    username: string;
    email: string;
    role: string;
  };

  const user = await db.query.users.findFirst({
    columns: {
      username: true,
      email: true,
    },
    where: {
      id: { eq: userId },
    },
  });

  if (!user) {
    throw new InvalidTokenError();
  }

  return {
    username: user.username,
    email: user.email,
  };
}
