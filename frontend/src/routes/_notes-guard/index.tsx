import { AddNoteForm } from "@/components/add-note-form";
import { NoteGrid } from "@/components/note-grid";
import { SearchAddNote } from "@/components/search-add-note";
import { useNotes } from "@/hooks/use-notes";
import { cn } from "@/lib/utils";
import { createFileRoute } from "@tanstack/react-router";
import { useState, type ChangeEvent } from "react";

export const Route = createFileRoute("/_notes-guard/")({ component: Home });

function Home() {
  const { notes } = useNotes();
  const [isAddNoteFormShowed, setAddNoteFormShowed] = useState<boolean>(false);
  const [searchString, setSearchString] = useState<string>("");

  const handleNewNoteButtonClick = () => {
    setAddNoteFormShowed(true);
  };

  const handleSearchChange = (
    e: ChangeEvent<HTMLInputElement, HTMLInputElement>,
  ) => {
    setSearchString(e.target.value);
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
        <NoteGrid notes={notes.filter((note) => !note.isArchived)} />
      </section>

      <section className="my-8">
        <h2>Archived Note</h2>
        <NoteGrid notes={notes.filter((note) => note.isArchived)} />
      </section>
    </>
  );
}
