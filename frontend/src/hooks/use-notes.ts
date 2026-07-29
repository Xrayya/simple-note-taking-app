import { noteListOption } from "#/lib/api.ts";
import type { Note, NoteFilter } from "#/models/notes.ts";
import { useQuery } from "@tanstack/react-query";

export function useNote(filter?: NoteFilter, initialData?: Note[]) {
  return useQuery(noteListOption(filter, initialData));
}
