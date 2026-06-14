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
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

type Props = ComponentProps<"div"> &
  Note & {
    onArchive?: (noteId: Note["id"]) => void;
    onDelete?: (noteId: Note["id"]) => void;
  };

export function NoteCard({
  id,
  title,
  body,
  className,
  onArchive,
  onDelete,
  ...restProps
}: Props) {
  return (
    <Card
      size="sm"
      className={cn("mx-auto w-full", className)}
      {...restProps}
    >
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          created at: to be implemented, updated at: to be implemented
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>{body}</p>
      </CardContent>
      <CardFooter className="grid gap-2 grid-cols-2">
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => {
            onArchive?.(id);
          }}
        >
          Archive
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => {
            onDelete?.(id);
          }}
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
