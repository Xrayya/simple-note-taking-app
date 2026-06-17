import { Hono } from "hono";
import { addNote, getNotes } from "../services/notes";
import { validateJsonRequest } from "../middlewares/validation";
import { addNoteSchema } from "../validation-schemas/notes";

export const notesRoute = new Hono()
  .get("/", async (c) => {
    const notes = await getNotes();

    return c.json({ notes }, 200);
  })
  .post("/", ...validateJsonRequest(addNoteSchema), async (c) => {
    const payload = c.req.valid("json");

    const newNote = await addNote(payload);

    return c.json({ newNote }, 201);
  })
  .put("/", (c) => {
    return c.json({ message: "entering notes route" });
  })
  .delete("/", (c) => {
    return c.json({ message: "entering notes route" });
  });
