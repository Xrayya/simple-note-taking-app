import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  DATABASE_URL: z.url().startsWith("postgresql://"),
  DATABASE_TABLE_PREFIX: z.string().default(""),
  JWT_SECRET: z.string().min(8),
  ALLOWED_ORIGINS: z
    .string()
    .default("http://localhost:3001")
    .transform((origins) => origins.split(",").map((origin) => origin.trim())),
});

export const env = envSchema.parse(Bun.env);

export const IS_PROD = env.NODE_ENV === "production";
