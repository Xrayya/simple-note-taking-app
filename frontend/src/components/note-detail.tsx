"use client";

import { formatTimestamp } from "#/lib/utils.ts";
import type { Note } from "#/models/notes.ts";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { Drawer as DrawerPrimitive } from "@base-ui/react/drawer";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { useState, type ComponentProps } from "react";
import { Skeleton } from "./ui/skeleton";

export type NoteDetailDrawerPayload = {
  noteId: string;
};

const noteDetailDrawerHandler =
  DrawerPrimitive.createHandle<NoteDetailDrawerPayload>();

type NoteDetailDrawerTriggerProps = Omit<
  ComponentProps<typeof DrawerTrigger>,
  "handle"
>;

export function NoteDetailDrawerTrigger(props: NoteDetailDrawerTriggerProps) {
  return <DrawerTrigger {...props} handle={noteDetailDrawerHandler} />;
}

function NoteDetailDrawerContent({ noteId }: NoteDetailDrawerPayload) {
  const { data, isLoading, error } = useQuery(
    queryOptions({
      queryKey: ["notes", { id: noteId }],
      // TODO: manipulate initial data
      queryFn: async (): Promise<{
        note: Note;
      }> => {
        const url = new URL(`/api/notes`, window.location.origin);
        url.searchParams.set("id", noteId);

        const response = await fetch(url);

        if (!response.ok) {
          const payload = await response.json();

          throw new Error(
            payload?.error?.message || "An error occurred while fetching data",
            { cause: payload?.error?.name },
          );
        }

        const payload = await response.json();
        return { note: payload.notes[0] };
      },
    }),
  );

  if (!data) {
    if (isLoading) {
      return (
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>
              <Skeleton className="h-5 w-full" />
            </DrawerTitle>
            <DrawerDescription>
              <Skeleton className="h-4 w-2/3" />
            </DrawerDescription>
          </DrawerHeader>
          <div className="flex flex-col gap-2 p-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <DrawerFooter>
            <Button disabled={true} className="h-8.5">
              Save
            </Button>
            <DrawerClose
              render={
                <Button disabled={true} variant="outline">
                  Cancel
                </Button>
              }
            />
          </DrawerFooter>
        </DrawerContent>
      );
    }

    return (
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Something Unexpected Happened...</DrawerTitle>
        </DrawerHeader>
        <div className="p-4">{error?.message}</div>
        <DrawerFooter>
          <DrawerClose render={<Button variant="outline">Cancel</Button>} />
        </DrawerFooter>
      </DrawerContent>
    );
  }

  return (
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>
          <input
            value={data.note.title}
            className="size-full border-none bg-transparent text-inherit placeholder-white/60 outline-none"
          />
        </DrawerTitle>
        <DrawerDescription>
          {formatTimestamp({
            createdAt: new Date(data.note.createdAt),
            updatedAt: data.note.updatedAt
              ? new Date(data.note.updatedAt)
              : null,
          })}
        </DrawerDescription>
      </DrawerHeader>
      <div className="p-4">
        <textarea
          value={data.note.body}
          className="size-full border-none bg-transparent text-inherit placeholder-white/60 outline-none"
        />
      </div>
      <DrawerFooter>
        <Button className="h-8.5">Save</Button>
        <DrawerClose render={<Button variant="outline">Cancel</Button>} />
      </DrawerFooter>
    </DrawerContent>
  );
}

type NoteDetailDrawerProps = ComponentProps<typeof Drawer>;

export function NoteDetailDrawer({ ...props }: NoteDetailDrawerProps) {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
      showSwipeHandle={isMobile}
      swipeDirection={isMobile ? "down" : "right"}
      handle={noteDetailDrawerHandler}
      {...props}
    >
      {({ payload }) =>
        payload ? (
          <NoteDetailDrawerContent
            noteId={(payload as NoteDetailDrawerPayload).noteId}
          />
        ) : (
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Something Unexpected Happened...</DrawerTitle>
            </DrawerHeader>
            <div className="p-4">No Data Provided</div>
            <DrawerFooter>
              <DrawerClose render={<Button variant="outline">Cancel</Button>} />
            </DrawerFooter>
          </DrawerContent>
        )
      }
    </Drawer>
  );
}
