import {
  createContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import z from "zod";

type NoteInput = {
  title: string;
  body: string;
  isArchived: boolean;
};

export type Note = NoteInput & { id: string };

interface NotesContextType {
  notes: Note[];
  addNote: (note: NoteInput) => Note;
  updateNote: (noteId: Note["id"], updatedNote: NoteInput) => Note;
  deleteNote: (noteId: Note["id"]) => Note;
}

export const NotesContext = createContext<NotesContextType | undefined>(
  undefined,
);

export function NotesProvider({ children }: PropsWithChildren) {
  const [notes, setNotes] = useState<Note[]>(() => {
    const savedNotesString = localStorage.getItem("notes");

    if (!savedNotesString) {
      return [];
    }

    const parsedSavedNotes = JSON.parse(savedNotesString);

    const validNotesSchema = z.array(
      z.object({
        id: z.string(),
        title: z.string(),
        body: z.string(),
        isArchived: z.boolean(),
      }),
    );

    const validatedSavedNotes = validNotesSchema.safeParse(parsedSavedNotes);

    if (!validatedSavedNotes.success) {
      localStorage.removeItem("notes");
      return [];
    }

    return validatedSavedNotes.data || [];
  });

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const addNote = (note: NoteInput) => {
    const newNote: Note = { ...note, id: `${notes.length + 1}` };

    setNotes((notes) => {
      return [...notes, newNote];
    });

    return newNote;
  };

  const updateNote = (noteId: Note["id"], updateNote: NoteInput) => {
    const noteIdx = notes.findIndex((note) => {
      return note.id === noteId;
    });

    const newNotes = [...notes];

    newNotes[noteIdx] = { id: noteId, ...updateNote };

    setNotes(newNotes);

    return newNotes[noteIdx];
  };

  const deleteNote = (noteId: Note["id"]) => {
    const noteIdx = notes.findIndex((note) => {
      return note.id === noteId;
    });

    const deletedNote = notes[noteIdx];

    const newNotes = [...notes];

    newNotes.splice(noteIdx, 1);

    setNotes(newNotes);

    return deletedNote;
  };

  return (
    <NotesContext.Provider value={{ notes, addNote, updateNote, deleteNote }}>
      {children}
    </NotesContext.Provider>
  );
}
