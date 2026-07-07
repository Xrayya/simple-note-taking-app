import { NoteDetailDrawer } from "#/components/note-detail.tsx";
import { NoteGrid } from "#/components/note-grid.tsx";
import { SearchNoteBar } from "#/components/search-note-bar.tsx";
import { FieldGroup, FieldSet } from "#/components/ui/field.tsx";
import { noteListOption, useNote } from "#/hooks/use-notes.ts";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/_notes-guard/archive")({
  component: RouteComponent,
});

function RouteComponent() {
  const [searchString, setSearchString] = useState<string>("");

  const queryClient = useQueryClient();

  const { data, isLoading, error } = useNote(
    {
      searchString,
      isArchived: true,
    },
    (() => {
      return queryClient
        .getQueryData(noteListOption().queryKey)
        ?.filter(
          (data) =>
            data.isArchived === true &&
            (data.title.includes(searchString) ||
              data.body.includes(searchString)),
        );
    })(),
  );

  const handleSearchChange = (s: string) => {
    setSearchString(s);
  };

  return (
    <div className="flex flex-1 flex-col gap-8">
      <NoteDetailDrawer />
      <section className="flex flex-1 flex-col gap-4">
        <FieldSet className="w-full">
          <FieldGroup className="flex flex-row gap-4">
            <SearchNoteBar
              resultCount={searchString.length > 0 ? data?.length : undefined}
              onSearchChange={handleSearchChange}
            />
          </FieldGroup>
        </FieldSet>
      </section>

      <section className="flex flex-1 flex-col gap-4">
        {isLoading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>{error.message}</div>
        ) : data?.length === 0 ? (
          <div>No Notes</div>
        ) : (
          <NoteGrid
            notes={
              data?.map(({ createdAt, updatedAt, ...rest }) => ({
                createdAt: new Date(createdAt),
                updatedAt: updatedAt ? new Date(updatedAt) : null,
                ...rest,
              })) || []
            }
          />
        )}
      </section>
    </div>
  );
}
