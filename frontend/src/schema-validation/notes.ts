import z from "zod";

export const addNoteSchema = z.object({
  title: z.string().min(1).max(500),
  body: z.string().min(1).max(4000),
});

export const updateNoteContentSchema = z.object({
  title: z.string().min(1).max(500),
  body: z.string().min(1).max(4000),
});
