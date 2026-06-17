import { db } from "../db/db";
import { notes } from "../db/schema";

type InputNoteType = {
  title: string;
  body: string;
  isArchived?: boolean;
};

type ReturnedNoteType = InputNoteType & {
  id: string;
  createdAt: Date;
  updatedAt: Date | null;
};

export async function getNotes(): Promise<ReturnedNoteType[]> {
  const result = await db.query.notes.findMany();

  return result;
}

export async function addNote(note: InputNoteType): Promise<ReturnedNoteType> {
  const result = await db
    .insert(notes)
    .values({ ...note })
    .returning();

  return result[0]!;
}
