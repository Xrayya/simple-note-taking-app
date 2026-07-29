import { useNote } from "#/hooks/use-notes.ts";
import { noteListOption } from "#/lib/api.ts";
import { authFetch, formatTimestamp } from "#/lib/utils.ts";
import type { Note } from "#/models/notes.ts";
import { updateNoteContentSchema } from "#/schema-validation/notes.ts";
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
import { useForm } from "@tanstack/react-form";
import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import { useState, type ComponentProps } from "react";
import type { z } from "zod";
import { Skeleton } from "./ui/skeleton";

export type NoteDetailDrawerPayload = {
  noteId: string;
};

export const noteDetailDrawerHandler =
  DrawerPrimitive.createHandle<NoteDetailDrawerPayload>();

type NoteDetailDrawerTriggerProps = Omit<
  ComponentProps<typeof DrawerTrigger>,
  "handle"
>;

export function NoteDetailDrawerTrigger(props: NoteDetailDrawerTriggerProps) {
  return <DrawerTrigger {...props} handle={noteDetailDrawerHandler} />;
}

function NoteDetailDrawerContent({ noteId }: NoteDetailDrawerPayload) {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useNote(
    { id: noteId },
    (() => {
      return queryClient
        .getQueryData(noteListOption().queryKey)
        ?.filter((data) => data.id === noteId);
    })(),
  );

  const updateNoteContent = useMutation({
    mutationFn: async (
      updatedNoteContent: z.infer<typeof updateNoteContentSchema>,
    ): Promise<Note> => {
      const url = new URL(`/api/notes/${noteId}`, window.location.origin);

      const response = await authFetch(url, {
        headers: { "Content-Type": "application/json" },
        method: "PUT",
        body: JSON.stringify({ ...updatedNoteContent }),
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

  const form = useForm({
    defaultValues: {
      title: data && data.length !== 0 ? data[0].title : "",
      body: data && data.length !== 0 ? data[0].body : "",
    },
    validators: {
      onChange: updateNoteContentSchema,
    },
    onSubmit: ({ value }) => {
      updateNoteContent.mutate({ ...value });
    },
  });

  if (!data) {
    if (isLoading) {
      return (
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>
              <Skeleton className="h-5 w-full" />
            </DrawerTitle>
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

  if (data.length === 0) {
    return (
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Something Unexpected Happened...</DrawerTitle>
        </DrawerHeader>
        <div className="p-4">No Data Provided</div>
        <DrawerFooter>
          <DrawerClose render={<Button variant="outline">Cancel</Button>} />
        </DrawerFooter>
      </DrawerContent>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
          <DrawerContent>
            <DrawerHeader>
              <form.Field name="title">
                {(field) => (
                  <DrawerTitle>
                    <input
                      type="text"
                      name={field.name}
                      value={field.state.value}
                      disabled={isSubmitting}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="size-full border-none bg-transparent text-inherit placeholder-white/60 outline-none"
                    />
                  </DrawerTitle>
                )}
              </form.Field>
              <DrawerDescription>
                {formatTimestamp({
                  createdAt: new Date(data[0].createdAt),
                  updatedAt: data[0].updatedAt
                    ? new Date(data[0].updatedAt)
                    : null,
                })}
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4">
              <form.Field name="body">
                {(field) => (
                  <textarea
                    name={field.name}
                    value={field.state.value}
                    disabled={isSubmitting}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="size-full border-none bg-transparent text-inherit placeholder-white/60 outline-none"
                  />
                )}
              </form.Field>
            </div>
            <DrawerFooter>
              <Button type="submit" disabled={!canSubmit} className="h-8.5">
                {isSubmitting ? (
                  <LoaderCircle className="animate-spin" />
                ) : null}
                Save
              </Button>
              <DrawerClose
                render={<Button variant="outline">Cancel</Button>}
                type="reset"
                disabled={isSubmitting}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  form.reset();
                }}
              />
            </DrawerFooter>
          </DrawerContent>
        )}
      </form.Subscribe>
    </form>
  );
}

type NoteDetailDrawerProps = ComponentProps<typeof Drawer>;

export function NoteDetailDrawer({
  onOpenChange,
  ...props
}: NoteDetailDrawerProps) {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleOpenChange = (
    nextOpen: boolean,
    event: DrawerPrimitive.Root.ChangeEventDetails,
  ) => {
    setOpen(nextOpen);
    onOpenChange?.(nextOpen, event);
  };

  return (
    <Drawer
      open={open}
      onOpenChange={handleOpenChange}
      showSwipeHandle={isMobile}
      swipeDirection={isMobile ? "down" : "right"}
      handle={noteDetailDrawerHandler}
      modal={false}
      disablePointerDismissal={true}
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
