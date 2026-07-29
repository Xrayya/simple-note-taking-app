import { accessToken } from "#/models/accessToken.ts";
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

export async function authFetch(
  input: string | URL | Request,
  init?: RequestInit,
) {
  let response = await fetch(input, {
    ...init,
    headers: {
      ...init?.headers,
      Authorization: `Bearer ${accessToken.get()}`,
    },
  });

  if (response.status === 401) {
    const newTokenResponse = await fetch(
      new URL("/api/auth/refresh", window.location.origin),
      {
        method: "POST",
        credentials: "include",
      },
    );

    if (!newTokenResponse.ok) {
      const payload = await newTokenResponse.json();

      throw new Error(
        payload?.error?.message || "An error occurred while fetching data",
        { cause: payload?.error?.name },
      );
    }

    accessToken.set((await newTokenResponse.json()).accessToken);

    response = await fetch(input, {
      ...init,
      headers: {
        ...init?.headers,
        Authorization: `Bearer ${accessToken.get()}`,
      },
    });
  }

  return response;
}
