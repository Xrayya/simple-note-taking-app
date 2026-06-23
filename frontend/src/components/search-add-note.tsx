import { NotebookPen, SearchIcon, X } from "lucide-react";
import type { ComponentProps } from "react";
import { Button } from "./ui/button";
import { Field, FieldGroup, FieldSet } from "./ui/field";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from "./ui/input-group";

type Props = ComponentProps<"fieldset"> & {
  onNewNoteButtonClick?: () => void;
  onSearchChange?: (s: string) => void;
};

export function SearchAddNote({
  onNewNoteButtonClick,
  onSearchChange,
  ...restProps
}: Props) {
  return (
    <FieldSet {...restProps} className="my-4 w-full">
      <FieldGroup className="flex flex-row gap-4">
        <Field>
          <InputGroup>
            <InputGroupInput
              id="search-note"
              placeholder="Search Note..."
              onChange={(e) => onSearchChange?.(e.target.value)}
            />
            <InputGroupAddon align="inline-start">
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupAddon align="inline-end">12 results</InputGroupAddon>
            <InputGroupAddon align="inline-end">
              <InputGroupButton variant="secondary" type="button">
                <X />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </Field>
        <Field className="w-fit">
          <Button type="button" onClick={onNewNoteButtonClick}>
            <NotebookPen /> New Note
          </Button>
        </Field>
      </FieldGroup>
    </FieldSet>
  );
}
