import { NotebookPen } from "lucide-react";
import type { ComponentProps } from "react";
import { Button } from "./ui/button";
import { Field } from "./ui/field";

type Props = ComponentProps<typeof Field> & {
  onNewNoteButtonClick?: () => void;
};

export function AddNoteButton({ onNewNoteButtonClick }: Props) {
  return (
    <Field className="w-fit">
      <Button type="button" onClick={onNewNoteButtonClick}>
        <NotebookPen /> New Note
      </Button>
    </Field>
  );
}
