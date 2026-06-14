import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Field, FieldGroup, FieldSet } from "./ui/field";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

export function AddNoteForm() {
  return (
    /* TODO: wrap into form */
    <Card>
      <CardHeader>
        <CardTitle>New Note</CardTitle>
      </CardHeader>
      <CardContent>
        <FieldSet className="w-full my-4">
          <FieldGroup>
            <Field>
              <Input id="note-title" type="text" placeholder="Note Title" />
            </Field>
            <Field>
              <Textarea
                id="note-body"
                placeholder="Your feedback helps us improve..."
                rows={4}
              />
            </Field>
          </FieldGroup>
        </FieldSet>
      </CardContent>
    </Card>
  );
}
