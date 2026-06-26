import { and, eq, gte, ilike, lte, or } from "drizzle-orm";
import { db } from "../db/db";
import { notes } from "../db/schema";
import { NoteNotFoundError } from "../exceptions/notes";

export type InputNoteType = {
  title: string;
  body: string;
  isArchived?: boolean;
};

export type ReturnedNoteType = InputNoteType & {
  id: string;
  createdAt: Date;
  updatedAt: Date | null;
};

export async function getNotes(
  filter?: Partial<typeof notes.$inferSelect> & {
    searchString?: string;
    createdAtFrom?: Date;
    createdAtUntil?: Date;
    updatedAtFrom?: Date;
    updatedAtUntil?: Date;
  },
): Promise<ReturnedNoteType[]> {
  const continueFilter = {
    title: true,
    body: true,
    isArchived: true,
    createdAt: true,
    updatedAt: true,
  };
  const conditions = [];

  if (filter?.id) {
    conditions.push(eq(notes.id, filter.id));
    continueFilter.title = false;
    continueFilter.body = false;
    continueFilter.isArchived = false;
    continueFilter.createdAt = false;
    continueFilter.updatedAt = false;
  }

  if (continueFilter.title && filter?.title) {
    conditions.push(ilike(notes.title, `%${filter.title}%`));
    continueFilter.title = false;
  }

  if (continueFilter.body && filter?.body) {
    conditions.push(ilike(notes.title, `%${filter.body}%`));
    continueFilter.body = false;
  }

  if (continueFilter.isArchived && filter?.isArchived !== undefined) {
    conditions.push(eq(notes.isArchived, filter.isArchived));
    continueFilter.isArchived = false;
  }

  if (continueFilter.createdAt && filter?.createdAt) {
    conditions.push(eq(notes.createdAt, filter.createdAt));
    continueFilter.createdAt = false;
  }

  if (continueFilter.updatedAt && filter?.updatedAt) {
    conditions.push(eq(notes.updatedAt, filter.updatedAt));
    continueFilter.updatedAt = false;
  }

  if ((continueFilter.body || continueFilter.title) && filter?.searchString) {
    conditions.push(
      ilike(notes.title, `%${filter.searchString}%`),
      ilike(notes.body, `%${filter.searchString}%`),
    );
  }

  if (continueFilter.createdAt && filter?.createdAtFrom) {
    conditions.push(gte(notes.createdAt, filter.createdAtFrom));
  }

  if (continueFilter.createdAt && filter?.createdAtUntil) {
    conditions.push(lte(notes.createdAt, filter.createdAtUntil));
  }

  if (continueFilter.updatedAt && filter?.updatedAtFrom) {
    conditions.push(gte(notes.updatedAt, filter.updatedAtFrom));
  }

  if (continueFilter.updatedAt && filter?.updatedAtUntil) {
    conditions.push(lte(notes.updatedAt, filter.updatedAtUntil));
  }

  const result = await db.query.notes.findMany({
    where: conditions.length > 0 ? or(...conditions) : undefined,
  });

  return result;
}

export async function addNote(note: InputNoteType): Promise<ReturnedNoteType> {
  const result = await db
    .insert(notes)
    .values({ ...note })
    .returning();

  return result[0]!;
}

export async function updateNote({
  noteId,
  updatedNoteData,
}: {
  noteId: ReturnedNoteType["id"];
  updatedNoteData: InputNoteType;
}): Promise<ReturnedNoteType> {
  const result = await db
    .update(notes)
    .set(updatedNoteData)
    .where(eq(notes.id, noteId))
    .returning();

  if (!result[0]) {
    throw new NoteNotFoundError(noteId);
  }

  return result[0];
}

export async function deleteNote({
  noteId,
}: {
  noteId: ReturnedNoteType["id"];
}): Promise<Pick<ReturnedNoteType, "id" | "title">> {
  const result = await db
    .delete(notes)
    .where(eq(notes.id, noteId))
    .returning({ id: notes.id, title: notes.title });

  if (!result[0]) {
    throw new NoteNotFoundError(noteId);
  }

  return result[0];
}
