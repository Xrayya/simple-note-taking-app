import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

const NOTE_TABLE_NAME = `${process.env["DATABASE_TABLE_PREFIX"]!}-notes`;

const timestamps = {
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at"),
};

export const notes = pgTable(NOTE_TABLE_NAME, {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  isArchived: boolean("archived").default(false).notNull(),
  ...timestamps,
});
