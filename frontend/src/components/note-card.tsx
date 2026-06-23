import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Note } from "@/contexts/notes-context";
import { useNotes } from "@/hooks/use-notes";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

type Props = ComponentProps<"div"> & Note;

export function NoteCard({
  id,
  title,
  body,
  isArchived,
  className,
  ...restProps
}: Props) {
  const { updateNote, deleteNote } = useNotes();

  return (
    <Card size="sm" className={cn("mx-auto w-full", className)} {...restProps}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          created at: to be implemented, updated at: to be implemented
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>{body}</p>
      </CardContent>
      <CardFooter className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => {
            updateNote(id, {
              title,
              body,
              isArchived: !isArchived,
            });
          }}
        >
          {isArchived ? "Unarchived" : "Archive"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => {
            deleteNote(id);
          }}
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
