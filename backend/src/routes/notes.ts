import { Hono } from "hono";

export const notesRoute = new Hono().get("/", (c) => {
  return c.json({ message: "entering notes route" });
});
