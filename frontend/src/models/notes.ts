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

export type NoteFilter = Partial<
  Note & {
    searchString: string;
    createdAtFrom: Date;
    createdAtUntil: Date;
    updatedAtFrom: Date;
    updatedAtUntil: Date;
  }
>;
