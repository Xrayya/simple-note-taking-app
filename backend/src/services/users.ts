import { db } from "../db/db";
import { UserNotFoundError } from "../exceptions/users";

type UserType = {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  googleId: string | null;
  createdAt: Date;
  updatedAt: Date | null;
};

export async function findByEmail({
  email,
}: {
  email: string;
}): Promise<UserType> {
  const result = await db.query.users.findFirst({
    where: { email: { eq: email } },
  });

  if (!result) {
    throw new UserNotFoundError("email", email);
  }

  return result;
}
