import type { Note } from "#/models/notes.ts";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import type { ComponentProps } from "react";

type Props = ComponentProps<"div"> & Note;

export function NoteCard({
  id,
  title,
  body,
  isArchived,
  createdAt,
  updatedAt,
  className,
  ...restProps
}: Props) {
  const queryClient = useQueryClient();

  const archiveUnarchiveNote = useMutation({
    mutationFn: async (): Promise<{
      newNote: {
        id: string;
        createdAt: Date;
        updatedAt: Date | null;
        title: string;
        body: string;
        isArchived?: boolean;
      };
    }> => {
      const url = new URL(
        `/notes/${id}`,
        import.meta.env.VITE_BACKEND_ENDPOINT,
      );

      const response = await fetch(url, {
        headers: { "Content-Type": "application/json" },
        method: "PUT",
        body: JSON.stringify({ isArchived: !isArchived }),
      });

      if (!response.ok) {
        const payload = await response.json();

        throw new Error(
          payload?.error?.message || "An error occurred while fetching data",
          { cause: payload?.error?.name },
        );
      }

      const payload = await response.json();
      return payload;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(
        queryOptions({
          queryKey: ["notes"],
        }),
      );
    },
  });

  const deleteNote = useMutation({
    mutationFn: async (): Promise<{
      newNote: {
        id: string;
        title: string;
      };
    }> => {
      const url = new URL(
        `/notes/${id}`,
        import.meta.env.VITE_BACKEND_ENDPOINT,
      );

      const response = await fetch(url, {
        headers: { "Content-Type": "application/json" },
        method: "DELETE",
      });

      if (!response.ok) {
        const payload = await response.json();

        throw new Error(
          payload?.error?.message || "An error occurred while fetching data",
          { cause: payload?.error?.name },
        );
      }

      const payload = await response.json();
      return payload;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(
        queryOptions({
          queryKey: ["notes"],
        }),
      );
    },
  });

  return (
    <Card className={cn("mx-auto w-full", className)} {...restProps}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{`created at: ${createdAt.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}${updatedAt
            ? ", last updated: " +
            updatedAt?.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
            : ""
          }`}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{body}</p>
      </CardContent>
      <CardFooter className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          className="w-full"
          disabled={archiveUnarchiveNote.isPending}
          onClick={() => {
            archiveUnarchiveNote.mutate();
          }}
        >
          {archiveUnarchiveNote.isPending ? (
            <LoaderCircle className="animate-spin" />
          ) : null}
          {isArchived ? "Unarchived" : "Archive"}
        </Button>
        <Button
          variant="destructive"
          className="w-full"
          disabled={deleteNote.isPending}
          onClick={() => {
            deleteNote.mutate();
          }}
        >
          {deleteNote.isPending ? (
            <LoaderCircle className="animate-spin" />
          ) : null}
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
