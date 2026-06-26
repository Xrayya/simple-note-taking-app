import { addNoteSchema } from "#/schema-validation/notes.ts";
import { useForm } from "@tanstack/react-form";
import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import type { ComponentProps } from "react";
import type z from "zod";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Field, FieldGroup, FieldSet } from "./ui/field";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

type Props = ComponentProps<"div"> & {
  onCancel?: () => void;
  onCompleteSubmit?: () => void;
};

export function AddNoteForm({
  onCancel,
  onCompleteSubmit,
  ...restProps
}: Props) {
  const queryClient = useQueryClient();

  const addNote = useMutation({
    mutationFn: async (
      newNote: z.infer<typeof addNoteSchema>,
    ): Promise<{
      newNote: {
        id: string;
        createdAt: Date;
        updatedAt: Date | null;
        title: string;
        body: string;
        isArchived?: boolean;
      };
    }> => {
      const url = new URL("/notes", import.meta.env.VITE_BACKEND_ENDPOINT);

      const response = await fetch(url, {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ ...newNote }),
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

  const form = useForm({
    defaultValues: {
      title: "",
      body: "",
    },
    validators: {
      onChange: addNoteSchema,
    },
    onSubmit: ({ value }) => {
      addNote.mutate({ ...value });
      form.reset();
    },
  });

  return (
    <Card {...restProps}>
      <CardHeader>
        <CardTitle>New Note</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
            onCompleteSubmit?.();
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
                        onCancel?.();
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
      </CardContent>
    </Card>
  );
}
