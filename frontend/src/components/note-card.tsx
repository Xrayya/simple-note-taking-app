import type { Note } from "#/models/notes.ts";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authFetch, cn } from "@/lib/utils";
import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  Download,
  EllipsisVertical,
  LoaderCircle,
  TrashIcon,
  Upload,
} from "lucide-react";
import type { ComponentProps } from "react";
import {
  NoteDetailDrawerTrigger,
  type NoteDetailDrawerPayload,
} from "./note-detail";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

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
    mutationFn: async (): Promise<Note> => {
      const url = new URL(`/api/notes/${id}`, window.location.origin);

      const response = await authFetch(url, {
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
      return payload.updatedNote;
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
      id: string;
      title: string;
    }> => {
      const url = new URL(`/api/notes/${id}`, window.location.origin);

      const response = await authFetch(url, {
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
      return payload.deletedNote;
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
    <NoteDetailDrawerTrigger
      nativeButton={false}
      payload={{ noteId: id } as NoteDetailDrawerPayload}
      render={
        <Card
          className={cn(
            "mx-auto w-full transition-all scale-100 hover:scale-105",
            className,
          )}
          {...restProps}
        >
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>
              <>
                {"created at: "}
                {createdAt.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </>
              {updatedAt ? (
                <>
                  {", last updated: "}
                  {updatedAt?.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </>
              ) : null}
            </CardDescription>
            <CardAction>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon-xs"
                    className="rounded-full"
                  >
                    <EllipsisVertical />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-fit" align="start">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>Action</DropdownMenuLabel>
                    <DropdownMenuItem
                      disabled={archiveUnarchiveNote.isPending}
                      onSelect={() => {
                        archiveUnarchiveNote.mutate();
                      }}
                    >
                      {isArchived ? (
                        <>
                          <Upload />
                          Unarchived
                        </>
                      ) : (
                        <>
                          <Download />
                          Archive
                        </>
                      )}
                      {archiveUnarchiveNote.isPending ? (
                        <LoaderCircle className="ml-auto animate-spin" />
                      ) : null}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      variant="destructive"
                      disabled={deleteNote.isPending}
                      onSelect={() => {
                        deleteNote.mutate();
                      }}
                    >
                      <TrashIcon />
                      Delete
                      {deleteNote.isPending ? (
                        <LoaderCircle className="ml-auto animate-spin" />
                      ) : null}
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardAction>
          </CardHeader>
          <CardContent>
            <p>{body}</p>
          </CardContent>
        </Card>
      }
    />
  );
}
