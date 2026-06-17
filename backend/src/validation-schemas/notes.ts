import z from "zod";
import { BaseRequestSchema } from "./base";

export const addNoteSchema = new BaseRequestSchema({
  jsonSchema: z.object({
    title: z.string().min(1).max(500),
    body: z.string().min(1).max(4000),
    isArchived: z.boolean().optional(),
  }),
  cookieSchema: z.object({}),
  formSchema: z.object({}),
  headerSchema: z.object({}),
  paramSchema: z.object({}),
  querySchema: z.object({}),
});
