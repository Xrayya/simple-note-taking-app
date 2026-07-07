import type { Note } from "#/models/notes.ts";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";
import { NoteCard } from "./note-card";

type Props = ComponentProps<"div"> & {
  notes: Note[];
};

export function NoteGrid({ notes, className, ...restProps }: Props) {
  return (
    <div
      className={cn(
        "grid gap-4 grid-cols-[repeat(auto-fill,minmax(18rem,1fr))]",
        className,
        { ...restProps },
      )}
    >
      {notes.map((note, idx) => (
        <NoteCard key={idx} {...note} />
      ))}
    </div>
  );
}
