import { Button } from "#/components/ui/button.tsx";
import { Field, FieldGroup, FieldSet } from "#/components/ui/field.tsx";
import { Input } from "#/components/ui/input.tsx";
import { Textarea } from "#/components/ui/textarea.tsx";
import { toast } from "#/components/ui/toast.tsx";
import { noteListOption } from "#/lib/api.ts";
import { authFetch } from "#/lib/utils.ts";
import type { Note } from "#/models/notes.ts";
import {
  addNoteSchema,
  updateNoteContentSchema,
} from "#/schema-validation/notes.ts";
import { useForm } from "@tanstack/react-form";
import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { LoaderCircle } from "lucide-react";
import type { z } from "zod";
import { Route as homeRoute } from "../index";

export const Route = createFileRoute("/_auth/notes/$noteId")({
  loader: async ({ params, context }) => {
    try {
      const noteData = await context.queryClient.fetchQuery(
        noteListOption({ id: params.noteId }),
      );

      if (noteData.length < 1) {
        toast.add({
          type: "error",
          description: "Could not found the specified note",
        });

        return undefined;
      }

      return {
        title: noteData[0].title,
        body: noteData[0].body,
      };
    } catch {
      return undefined;
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const data = Route.useLoaderData();
  const noteId = Route.useParams().noteId;

  const queryClient = useQueryClient();

  const addNote = useMutation({
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
    onSuccess: async (_data, { title }) => {
      toast.add({
        type: "success",
        description: `Succesfully update note '${title}'`,
      });

      await queryClient.invalidateQueries(
        queryOptions({
          queryKey: ["notes", { id: noteId }],
        }),
      );
    },
  });

  const form = useForm({
    defaultValues: {
      title: data?.title || "",
      body: data?.body || "",
    },
    validators: {
      onChange: addNoteSchema,
    },
    onSubmit: async ({ value }) => {
      // await addNote.mutateAsync({ ...value });
      form.reset();
    },
  });


  if (!data) {
    toast.add({
      type: "error",
      description: "Could not find the specified note",
    });
    return <Navigate to={homeRoute.to} />;
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
          <FieldSet className="w-full">
            <FieldGroup>
              <form.Field name="title">
                {(field) => (
                  <Field>
                    <Input
                      type="text"
                      name={field.name}
                      value={field.state.value}
                      disabled={isSubmitting}
                      onBlur={field.handleBlur}
                      onChange={(e) => {
                        field.handleChange(e.target.value);
                      }}
                      placeholder="Note Title"
                    />
                  </Field>
                )}
              </form.Field>
              <form.Field name="body">
                {(field) => (
                  <Field>
                    <Textarea
                      name={field.name}
                      value={field.state.value}
                      disabled={isSubmitting}
                      onBlur={field.handleBlur}
                      onChange={(e) => {
                        field.handleChange(e.target.value);
                      }}
                      placeholder="Your feedback helps us improve..."
                      rows={4}
                    />
                  </Field>
                )}
              </form.Field>
              <Field orientation="horizontal">
                <Button type="submit" disabled={!canSubmit}>
                  {isSubmitting ? (
                    <LoaderCircle className="animate-spin" />
                  ) : null}
                  Add Note
                </Button>
                <Button
                  variant="destructive"
                  type="reset"
                  disabled={isSubmitting}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.reset();
                  }}
                >
                  Cancel
                </Button>
              </Field>
            </FieldGroup>
          </FieldSet>
        )}
      </form.Subscribe>
    </form>
  );
}
