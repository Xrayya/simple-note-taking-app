import type { Note } from "#/models/notes.ts";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  // eslint-disable-next-line tailwindcss/no-custom-classname
  return twMerge(clsx(inputs));
}

export function formatTimestamp({
  createdAt,
  updatedAt,
  locales,
  options,
}: Pick<Note, "createdAt" | "updatedAt"> & {
  locales?: Intl.LocalesArgument;
  options?: Intl.DateTimeFormatOptions;
}): string {
  return `created at: 
            ${createdAt.toLocaleDateString(
    locales || "en-US",
    options || {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  )}
          ${updatedAt
      ? ", last updated: " +
      updatedAt?.toLocaleDateString(
        locales || "en-US",
        options || {
          month: "short",
          day: "numeric",
          year: "numeric",
        },
      )
      : ""
    }`;
}
