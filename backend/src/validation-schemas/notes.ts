import z from "zod";
import { BaseRequestSchema } from "./base";

export const getNotesSchema = new BaseRequestSchema({
  jsonSchema: z.object({}),
  cookieSchema: z.object({}),
  formSchema: z.object({}),
  headerSchema: z.object({}),
  paramSchema: z.object({}),
  querySchema: z.object({
    id: z.uuid().optional(),
    title: z.string().min(1).max(500).optional(),
    body: z.string().min(1).max(4000).optional(),
    isArchived: z
      .string()
      .transform((val) => val.toLowerCase())
      .refine((val) => ["true", "false"].includes(val), {
        message: "String must be exactly 'true' or 'false'",
      })
      .transform((val) => val === "true")
      .optional(),
    createdAt: z.iso
      .date()
      .transform((val) => new Date(val))
      .optional(),
    updatedAt: z.iso
      .date()
      .transform((val) => new Date(val))
      .optional(),
    searchString: z.string().max(4000).optional(),
    createdAtFrom: z.iso
      .date()
      .transform((val) => new Date(val))
      .optional(),
    createdAtUntil: z.iso
      .date()
      .transform((val) => new Date(val))
      .optional(),
    updatedAtFrom: z.iso
      .date()
      .transform((val) => new Date(val))
      .optional(),
    updatedAtUntil: z.iso
      .date()
      .transform((val) => new Date(val))
      .optional(),
  }),
});

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

export const updateNoteSchema = new BaseRequestSchema({
  jsonSchema: z.object({
    title: z.string().min(1).max(500).optional(),
    body: z.string().min(1).max(4000).optional(),
    isArchived: z.boolean().optional().optional(),
  }),
  cookieSchema: z.object({}),
  formSchema: z.object({}),
  headerSchema: z.object({}),
  paramSchema: z.object({}),
  querySchema: z.object({}),
});
