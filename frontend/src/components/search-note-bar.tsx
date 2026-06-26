import { SearchIcon, X } from "lucide-react";
import type { ComponentProps } from "react";
import { Field } from "./ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "./ui/input-group";

type Props = ComponentProps<"fieldset"> & {
  onSearchChange?: (s: string) => void;
};

export function SearchAddNote({ onSearchChange }: Props) {
  return (
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
  );
}
