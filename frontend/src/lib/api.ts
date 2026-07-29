import type { Note, NoteFilter } from "#/models/notes.ts";
import { queryOptions } from "@tanstack/react-query";
import { authFetch } from "./utils";

export function noteListOption(filter?: NoteFilter, initialData?: Note[]) {
  return queryOptions({
    queryKey: ["notes", filter] as const,
    initialData,
    queryFn: async (): Promise<Note[]> => {
      const url = new URL("/api/notes", window.location.origin);

      if (filter?.id) {
        url.searchParams.set("id", filter?.id);
      }

      if (filter?.title) {
        url.searchParams.set("title", filter?.title);
      }

      if (filter?.body) {
        url.searchParams.set("body", filter?.body);
      }

      if (filter?.isArchived) {
        url.searchParams.set(
          "isArchived",
          filter?.isArchived ? "true" : "false",
        );
      }

      if (filter?.createdAt) {
        url.searchParams.set("createdAt", filter?.createdAt.toString());
      }

      if (filter?.updatedAt) {
        url.searchParams.set("updatedAt", filter?.updatedAt.toString());
      }

      if (!!filter?.searchString && filter?.searchString.length > 0) {
        url.searchParams.set("searchString", filter?.searchString);
      }

      if (filter?.createdAtFrom) {
        url.searchParams.set("createdAtFrom", filter?.createdAtFrom.toString());
      }

      if (filter?.createdAtUntil) {
        url.searchParams.set(
          "createdAtUntil",
          filter?.createdAtUntil.toString(),
        );
      }

      if (filter?.updatedAtFrom) {
        url.searchParams.set("updatedAtFrom", filter?.updatedAtFrom.toString());
      }

      if (filter?.updatedAtUntil) {
        url.searchParams.set(
          "updatedAtUntil",
          filter?.updatedAtUntil.toString(),
        );
      }

      const response = await fetch(url);

      if (!response.ok) {
        const payload = await response.json();

        throw new Error(
          payload?.error?.message || "An error occurred while fetching data",
          { cause: payload?.error?.name },
        );
      }

      const payload = await response.json();
      return payload.notes;
    },
  });
}

