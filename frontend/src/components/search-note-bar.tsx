import { SearchIcon, X } from "lucide-react";
import { useEffect, useState, type ComponentProps } from "react";
import { Field } from "./ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "./ui/input-group";

type Props = ComponentProps<typeof Field> & {
  onSearchChange?: (s: string) => void;
  resultCount?: number;
};

export function SearchNoteBar({
  onSearchChange,
  resultCount,
  ...restProps
}: Props) {
  const [searchString, setSearchString] = useState("");

  useEffect(() => {
    onSearchChange?.(searchString);
  }, [searchString, onSearchChange]);

  return (
    <Field {...restProps}>
      <InputGroup>
        <InputGroupInput
          id="search-note"
          placeholder="Search Note..."
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
        />
        <InputGroupAddon align="inline-start">
          <SearchIcon />
        </InputGroupAddon>
        {resultCount ? (
          <InputGroupAddon align="inline-end">
            {resultCount} result
          </InputGroupAddon>
        ) : null}
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            variant="secondary"
            type="button"
            onClick={() => setSearchString("")}
          >
            <X />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}
