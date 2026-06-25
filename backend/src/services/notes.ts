import { and, eq, getTableColumns, type Column } from "drizzle-orm";
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
  filter?: Partial<typeof notes.$inferSelect>,
): Promise<ReturnedNoteType[]> {
  const conditions = [];

  // NOTE: a hacky way generated from Gemini
  const columns = getTableColumns(notes);

  if (filter) {
    for (const [key, value] of Object.entries(filter)) {
      if (value !== undefined && key in columns) {
        const column = columns[key as keyof typeof columns] as Column;
        conditions.push(eq(column, value));
      }
    }
  }

  const result = await db.query.notes.findMany({
    where: conditions.length > 0 ? and(...conditions) : undefined,
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
