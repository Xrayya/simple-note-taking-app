import { compareSync, hashSync } from "bcrypt-ts";
import { jwtVerify, SignJWT, type JWTPayload } from "jose";
import { InvalidTokenError } from "./exceptions/auth";
import { env } from "./env";

export const SECRET = new TextEncoder().encode(env.JWT_SECRET);

export const hasher = {
  encrypt: (data: string): string => {
    return hashSync(data, 14);
  },
  verify: (encryptedPassword: string, inputPassword: string): boolean => {
    return compareSync(inputPassword, encryptedPassword);
  },
};

export const jwt = {
  sign: async (payload: any): Promise<string> => {
    return await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      // .setExpirationTime("10m")
      .setExpirationTime("4s") // 4 seconds for testing purposes
      .sign(SECRET);
  },
  verify: async (token: string): Promise<JWTPayload> => {
    try {
      const { payload } = await jwtVerify(token, SECRET);
      return payload;
    } catch (error) {
      throw new InvalidTokenError();
    }
  },
};
