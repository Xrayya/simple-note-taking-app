export type NoteInput = {
  title: string;
  body: string;
  isArchived: boolean;
};

export type Note = NoteInput & {
  id: string;
  createdAt: Date;
  updatedAt: Date | null;
};
