import { Hono } from "hono";
import {
  validateJsonRequest,
  validateRequest,
} from "../middlewares/validation";
import { addNote, deleteNote, getNotes, updateNote } from "../services/notes";
import {
  addNoteSchema,
  getNotesSchema,
  updateNoteSchema,
} from "../validation-schemas/notes";
import { db } from "../db/db";
import { users } from "../db/schema";

export const notesRoute = new Hono()
  .get("/", ...validateRequest(getNotesSchema), async (c) => {
    const filters = c.req.valid("query");

    const notes = await getNotes(filters);

    return c.json({ notes }, 200);
  })
  .post("/", ...validateJsonRequest(addNoteSchema), async (c) => {
    const newNoteData = c.req.valid("json");

    let dbUsers = await db.query.users.findMany();

    if (dbUsers.length === 0) {
      dbUsers = await db
        .insert(users)
        .values({
          email: "bambang@example.com",
          username: "bambang",
          passwordHash: "mockpassowrd",
        })
        .returning();
    }

    const newNote = await addNote({
      ...newNoteData,
      authorId: dbUsers[0]?.id!,
    });

    return c.json({ newNote }, 201);
  })
  .put("/:noteId", ...validateJsonRequest(updateNoteSchema), async (c) => {
    const noteId = c.req.param("noteId");

    const updatedNoteData = c.req.valid("json");

    const updatedNote = await updateNote({ noteId, updatedNoteData });

    return c.json({ updatedNote }, 200);
  })
  .delete("/:noteId", async (c) => {
    const noteId = c.req.param("noteId");

    const deletedNote = await deleteNote({ noteId });

    return c.json({ deletedNote }, 200);
  });
