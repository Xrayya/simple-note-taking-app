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
import { cn } from "@/lib/utils";
import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Download, EllipsisVertical, TrashIcon, Upload } from "lucide-react";
import type { ComponentProps } from "react";
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
              <Button variant="outline" size="icon-xs" className="rounded-full">
                <EllipsisVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-fit" align="start">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Action</DropdownMenuLabel>
                <DropdownMenuItem
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
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  onSelect={() => {
                    deleteNote.mutate();
                  }}
                >
                  <TrashIcon />
                  Delete
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
  );
}
