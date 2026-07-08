import {
  boolean,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

const USER_TABLE_NAME = `${process.env["DATABASE_TABLE_PREFIX"]!}-users`;
const NOTE_TABLE_NAME = `${process.env["DATABASE_TABLE_PREFIX"]!}-notes`;
const REFRESH_TOKEN_TABLE_NAME = `${process.env["DATABASE_TABLE_PREFIX"]!}-refresh-token`;

const timestamps = {
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at"),
};

export const users = pgTable(USER_TABLE_NAME, {
  id: uuid("id").primaryKey().defaultRandom(),
  username: varchar("username", { length: 100 }).notNull(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  ...timestamps,
});

export const notes = pgTable(NOTE_TABLE_NAME, {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  isArchived: boolean("archived").default(false).notNull(),
  authorId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  ...timestamps,
});

export const refreshTokens = pgTable(REFRESH_TOKEN_TABLE_NAME, {
  id: uuid("id").defaultRandom().primaryKey(),
  ownerId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token: uuid("token").notNull().unique().defaultRandom(),
  expiredAt: timestamp("expired_at").notNull(),
});
