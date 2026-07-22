import { Hono } from "hono";
import { authMiddleware } from "../middlewares/auth";
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

export const notesRoute = new Hono()
  .use(authMiddleware)
  .get("/", ...validateRequest(getNotesSchema), async (c) => {
    const userId = c.get("user").userId;

    const filters = c.req.valid("query");

    const notes = await getNotes(userId, filters);

    return c.json({ notes }, 200);
  })
  .post("/", ...validateJsonRequest(addNoteSchema), async (c) => {
    const userId = c.get("user").userId;

    const newNoteData = c.req.valid("json");

    const newNote = await addNote(userId, {
      ...newNoteData,
    });

    return c.json({ newNote }, 201);
  })
  .put("/:noteId", ...validateJsonRequest(updateNoteSchema), async (c) => {
    const userId = c.get("user").userId;

    const noteId = c.req.param("noteId");

    const updatedNoteData = c.req.valid("json");

    const updatedNote = await updateNote(userId, { noteId, updatedNoteData });

    return c.json({ updatedNote }, 200);
  })
  .delete("/:noteId", async (c) => {
    const userId = c.get("user").userId;

    const noteId = c.req.param("noteId");

    const deletedNote = await deleteNote(userId, { noteId });

    return c.json({ deletedNote }, 200);
  });
