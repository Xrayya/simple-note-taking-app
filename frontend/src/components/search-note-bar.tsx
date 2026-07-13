import { LoaderCircle, SearchIcon, X } from "lucide-react";
import { useEffect, useState, type ComponentProps } from "react";
import { Field } from "./ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "./ui/input-group";
import { useDebouce } from "#/hooks/use-debounce.ts";

type Props = ComponentProps<typeof Field> & {
  debounce?: number;
  onSearchChange?: (s: string) => void;
  loading?: boolean;
  resultCount?: number;
};

export function SearchNoteBar({
  debounce: debouce,
  onSearchChange,
  resultCount,
  loading,
  ...restProps
}: Props) {
  const [searchString, setSearchString] = useState("");
  const debouncedSearchString = useDebouce(searchString, debouce || 0);

  useEffect(() => {
    onSearchChange?.(debouncedSearchString);
  }, [debouncedSearchString, onSearchChange]);

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
        {typeof resultCount === "number" || loading ? (
          <InputGroupAddon align="inline-end">
            {loading ? (
              <>
                <LoaderCircle className="animate-spin" />
              </>
            ) : (
              <>{resultCount} result</>
            )}
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
