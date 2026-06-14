import { useNotes } from "@/hooks/use-notes";
import { useForm } from "@tanstack/react-form";
import { LoaderCircle } from "lucide-react";
import type { ComponentProps } from "react";
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
  const { addNote } = useNotes();

  const form = useForm({
    defaultValues: {
      title: "",
      body: "",
    },
    onSubmit: ({ value }) => {
      addNote(value);
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
            children={([canSubmit, isSubmitting]) => (
              <FieldSet className="w-full my-4">
                <FieldGroup>
                  <form.Field
                    name="title"
                    children={(field) => (
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
                  />
                  <form.Field
                    name="body"
                    children={(field) => (
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
                  />
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
          />
        </form>
      </CardContent>
    </Card>
  );
}
