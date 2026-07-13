import { AddNoteButton } from "#/components/add-note-button.tsx";
import { SearchNoteBar } from "#/components/search-note-bar.tsx";
import { FieldGroup, FieldSet } from "#/components/ui/field.tsx";
import { noteListOption, useNote } from "#/hooks/use-notes.ts";
import { AddNoteForm } from "@/components/add-note-form";
import { NoteGrid } from "@/components/note-grid";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/_notes-guard/")({ component: Home });

function Home() {
  const [isAddNoteFormShowed, setAddNoteFormShowed] = useState<boolean>(false);
  const [searchString, setSearchString] = useState<string>("");

  const queryClient = useQueryClient();

  const { data, isLoading, error } = useNote(
    {
      searchString,
      isArchived: false,
    },
    (() => {
      return queryClient
        .getQueryData(noteListOption().queryKey)
        ?.filter(
          (data) =>
            data.isArchived === false &&
            (data.title.includes(searchString) ||
              data.body.includes(searchString)),
        );
    })(),
  );

  const handleNewNoteButtonClick = () => {
    setAddNoteFormShowed(true);
  };

  const handleSearchChange = (s: string) => {
    setSearchString(s);
  };

  const handleAddNoteFormCancel = () => {
    setAddNoteFormShowed(false);
  };

  const handleAddNoteCompleteSubmit = () => {
    setAddNoteFormShowed(false);
  };

  return (
    <div className="flex flex-1 flex-col gap-8">
      <section className="flex flex-1 flex-col gap-4">
        <FieldSet className="w-full">
          <FieldGroup className="flex flex-row gap-4">
            <SearchNoteBar
              loading={isLoading}
              debouce={200}
              resultCount={searchString.length > 0 ? data?.length : undefined}
              onSearchChange={handleSearchChange}
            />
            <AddNoteButton onNewNoteButtonClick={handleNewNoteButtonClick} />
          </FieldGroup>
        </FieldSet>
        <AddNoteForm
          className={cn(isAddNoteFormShowed ? null : "hidden")}
          onCompleteSubmit={handleAddNoteCompleteSubmit}
          onCancel={handleAddNoteFormCancel}
        />
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
