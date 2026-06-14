import { NotesContext } from "@/contexts/notes-context";
import { useContext } from "react";

export const useNotes = () => {
  const context = useContext(NotesContext);

  if (!context) {
    throw new Error("useNotes must be used within NotesProvider");
  }

  return context;
};
