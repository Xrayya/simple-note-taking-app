import { useNotes } from "@/hooks/use-notes";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Field, FieldGroup, FieldSet } from "./ui/field";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useForm } from "@tanstack/react-form";
import { Button } from "./ui/button";
import type { ComponentProps } from "react";

type Props = ComponentProps<"div"> & {
  onCancel: () => void;
};

export function AddNoteForm({ onCancel, ...restProps }: Props) {
  const { addNote } = useNotes();

  const form = useForm({
    defaultValues: {
      title: "",
      body: "",
    },
    onSubmit: ({ value }) => {
      addNote(value);
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
          }}
        >
          <FieldSet className="w-full my-4">
            <FieldGroup>
              <form.Field
                name="title"
                children={(field) => (
                  <Field>
                    <Input
                      type="text"
                      name={field.name}
                      onBlur={field.handleBlur}
                      onChange={(e) => {
                        field.handleChange(e.target.value);
                      }}
                      placeholder="Note Title"
                    />
                  </Field>
                )}
              />
              <form.Field
                name="body"
                children={(field) => (
                  <Field>
                    <Textarea
                      name={field.name}
                      onBlur={field.handleBlur}
                      onChange={(e) => {
                        field.handleChange(e.target.value);
                      }}
                      placeholder="Your feedback helps us improve..."
                      rows={4}
                    />
                  </Field>
                )}
              />
              <Field orientation="horizontal">
                <Button type="submit">Add Note</Button>
                <Button
                variant="destructive"
                  type="button"
                  onClick={() => {
                    form.reset();
                    onCancel();
                  }}
                >
                  Cancel
                </Button>
              </Field>
            </FieldGroup>
          </FieldSet>
        </form>
      </CardContent>
    </Card>
  );
}
