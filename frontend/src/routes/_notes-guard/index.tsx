import { AddNoteForm } from "@/components/add-note-form";
import { NoteGrid } from "@/components/note-grid";
import { SearchAddNote } from "@/components/search-add-note";
import { cn } from "@/lib/utils";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/_notes-guard/")({ component: Home });

const notesOptions = queryOptions({
  queryKey: ["notes"],
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
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_ENDPOINT!}/notes`,
    );

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
});

function Home() {
  const [isAddNoteFormShowed, setAddNoteFormShowed] = useState<boolean>(false);
  const [searchString, setSearchString] = useState<string>("");

  const { data, isLoading, error } = useQuery(notesOptions);

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
    setTimeout(() => {
      setAddNoteFormShowed(false);
    }, 1000);
  };

  return (
    <>
      <h1 className="my-16 text-center text-2xl">Simple Note Taking App</h1>

      <section className="my-4">
        <SearchAddNote
          onNewNoteButtonClick={handleNewNoteButtonClick}
          onSearchChange={handleSearchChange}
        />
        <AddNoteForm
          className={cn(isAddNoteFormShowed ? null : "hidden")}
          onCompleteSubmit={handleAddNoteCompleteSubmit}
          onCancel={handleAddNoteFormCancel}
        />
      </section>

      <section className="my-8">
        <h2>Active Note</h2>
        {isLoading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>{error.message}</div>
        ) : (
          <NoteGrid
            notes={data?.notes.filter((note) => !note.isArchived) || []}
          />
        )}
      </section>

      <section className="my-8">
        <h2>Archived Note</h2>
        {isLoading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>{error.message}</div>
        ) : (
          <NoteGrid
            notes={data?.notes.filter((note) => note.isArchived) || []}
          />
        )}
      </section>
    </>
  );
}
