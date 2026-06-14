import { AddNoteForm } from "@/components/add-note-form";
import { NoteCard } from "@/components/note-card";
import { SearchAddNote } from "@/components/search-add-note";
import { NotesProvider } from "@/contexts/notes-context";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({ component: Home });

type Note = {
  title: string;
  body: string;
};

function Home() {
  return (
    <NotesProvider>
      <h1 className="text-center text-2xl my-16">Simple Note Taking App</h1>

      <section className="my-4">
        <SearchAddNote />
        <AddNoteForm />
      </section>

      <section className="my-8">
        <h2>Active Note</h2>
        <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(24rem,1fr))]">
          <NoteCard></NoteCard>
          <NoteCard></NoteCard>
          <NoteCard></NoteCard>
          <NoteCard></NoteCard>
          <NoteCard></NoteCard>
          <NoteCard></NoteCard>
          <NoteCard></NoteCard>
          <NoteCard></NoteCard>
          <NoteCard></NoteCard>
          <NoteCard></NoteCard>
          <NoteCard></NoteCard>
          <NoteCard></NoteCard>
        </div>
      </section>

      <section className="my-8">
        <h2>Archived Note</h2>
        <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(24rem,1fr))]">
          <NoteCard></NoteCard>
          <NoteCard></NoteCard>
          <NoteCard></NoteCard>
          <NoteCard></NoteCard>
          <NoteCard></NoteCard>
          <NoteCard></NoteCard>
          <NoteCard></NoteCard>
          <NoteCard></NoteCard>
          <NoteCard></NoteCard>
          <NoteCard></NoteCard>
          <NoteCard></NoteCard>
          <NoteCard></NoteCard>
        </div>
      </section>
    </NotesProvider>
  );
}
