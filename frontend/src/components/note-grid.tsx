import type { Note } from "@/contexts/notes-context";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";
import { NoteCard } from "./note-card";

type Props = ComponentProps<"div"> & {
  notes: Note[];
  onNoteArchive?: (noteId: Note["id"]) => void;
  onNoteDelete?: (noteId: Note["id"]) => void;
};

export function NoteGrid({
  notes,
  onNoteArchive,
  onNoteDelete,
  className,
  ...restProps
}: Props) {
  return (
    <div
      className={cn(
        "grid gap-4 grid-cols-[repeat(auto-fill,minmax(24rem,1fr))]",
        className,
        { ...restProps },
      )}
    >
      {notes.map((note) => (
        <NoteCard key={note.id} {...note} onArchive={onNoteArchive} onDelete={onNoteDelete} />
      ))}
    </div>
  );
}
