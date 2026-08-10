import {
  boolean,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { env } from "../env";

const USER_TABLE_NAME = `${env.DATABASE_TABLE_PREFIX}-users`;
const NOTE_TABLE_NAME = `${env.DATABASE_TABLE_PREFIX}-notes`;
const TAG_TABLE_NAME = `${env.DATABASE_TABLE_PREFIX}-tags`;
const NOTE_TAGS_TABLE_NAME = `${env.DATABASE_TABLE_PREFIX}-note-tags`;
const REFRESH_TOKEN_TABLE_NAME = `${env.DATABASE_TABLE_PREFIX}-refresh-token`;

const timestamps = {
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at"),
};

export const users = pgTable(USER_TABLE_NAME, {
  id: uuid("id").primaryKey().defaultRandom(),
  username: varchar("username", { length: 100 }).notNull(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  googleId: varchar("google_id", { length: 255 }).unique(),
  ...timestamps,
});

export const tags = pgTable(TAG_TABLE_NAME, {
  id: uuid("id").primaryKey().defaultRandom(),
  ownerId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  tagName: varchar("tag_name", { length: 100 }).notNull(),
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

export const noteTags = pgTable(
  NOTE_TAGS_TABLE_NAME,
  {
    noteId: uuid("note_id"),
    tagId: uuid("tag_id"),
  },
  (table) => [primaryKey({ columns: [table.noteId, table.tagId] })],
);

export const refreshTokens = pgTable(REFRESH_TOKEN_TABLE_NAME, {
  id: uuid("id").defaultRandom().primaryKey(),
  ownerId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token: uuid("token").notNull().unique().defaultRandom(),
  expiredAt: timestamp("expired_at").notNull(),
});
