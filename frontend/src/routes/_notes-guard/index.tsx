import { AddNoteButton } from "#/components/add-note-button.tsx";
import { NoteDetailDrawer } from "#/components/note-detail-drawer.tsx";
import { SearchNoteBar } from "#/components/search-note-bar.tsx";
import { FieldGroup, FieldSet } from "#/components/ui/field.tsx";
import { AddNoteForm } from "@/components/add-note-form";
import { NoteGrid } from "@/components/note-grid";
import { cn } from "@/lib/utils";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/_notes-guard/")({ component: Home });

function Home() {
  const [isAddNoteFormShowed, setAddNoteFormShowed] = useState<boolean>(false);
  const [searchString, setSearchString] = useState<string>("");

  const { data, isLoading, error } = useQuery(
    queryOptions({
      queryKey: ["notes", { searchString, isArchived: false }],
      // TODO: manipulate initial data
      queryFn: async (): Promise<{
        notes: {
          id: string;
          createdAt: string;
          updatedAt: string | null;
          title: string;
          body: string;
          isArchived: boolean;
        }[];
      }> => {
        const url = new URL("/api/notes", window.location.origin);

        if (searchString.length > 0) {
          url.searchParams.set("searchString", searchString);
        }

        url.searchParams.set("isArchived", "false");

        const response = await fetch(url);

        if (!response.ok) {
          const payload = await response.json();

          throw new Error(
            payload?.error?.message || "An error occurred while fetching data",
            { cause: payload?.error?.name },
          );
        }

        const payload = await response.json();
        return payload;
      },
    }),
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
      <NoteDetailDrawer />
      <section className="flex flex-1 flex-col gap-4">
        <FieldSet className="w-full">
          <FieldGroup className="flex flex-row gap-4">
            <SearchNoteBar
              resultCount={
                searchString.length > 0 ? data?.notes.length : undefined
              }
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
        ) : data?.notes.length === 0 ? (
          <div>No Notes</div>
        ) : (
          <NoteGrid
            notes={
              data?.notes.map(({ createdAt, updatedAt, ...rest }) => ({
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
