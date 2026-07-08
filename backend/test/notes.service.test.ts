import { describe, beforeAll, afterAll, test, expect } from "bun:test";
import { db } from "../src/db/db";
import { notes, users } from "../src/db/schema";
import {
  addNote,
  deleteNote,
  getNotes,
  updateNote,
  type InputNoteType,
  type ReturnedNoteType,
} from "../src/services/notes";

const baseUrl = "http://localhost:3000";

let mockUser: typeof users.$inferInsert = {
  username: "bambang",
  email: "bambang@example.com",
  passwordHash: "mockpassword",
};

const mockNotes: InputNoteType[] = [
  {
    title: "Test Note 1",
    authorId: "",
    body: "Note Body Test 1; lorem ipsum; bla bla",
  },
  {
    title: "Test Note 2",
    authorId: "",
    body: "Note Body Test 2; babb al wlkj slk ejekjejdk",
  },
];

const mockArchivedNotes: InputNoteType[] = [
  {
    title: "Test Note 3",
    authorId: "",
    body: "lkasd as;lkdf asdfdfl;kjj asdkdlfj alksd jf;ka sdkfj ;aksld f;ka jsdkfk ;askd f;ak sdl;fja;sdk fas d",
    isArchived: true,
  },
  {
    title: "Test Note 100",
    authorId: "",
    body: "Note Body Test 2; babb al wlkj slk ejekjejdk ;alk a askldj l;ewl;jk askd f;ljkasassd;lf ewwldosnwoefn wfoe fwoe",
    isArchived: true,
  },
];

const mockUpdatedNote: InputNoteType = {
  title: "Updated Test Note Title",
  authorId: "",
  body: "Updated Test Note Body",
  isArchived: true,
};

let mockNotesDB: ReturnedNoteType[] = [];

describe("Notes", () => {
  beforeAll(async () => {
    mockUser = (
      await db
        .insert(users)
        .values({ ...mockUser })
        .returning()
    )[0]!;

    mockNotes.forEach((note) => {
      note.authorId = mockUser.id!;
    });
    mockArchivedNotes.forEach((note) => {
      note.authorId = mockUser.id!;
    });
    mockUpdatedNote.authorId = mockUser.id!;
  });

  afterAll(async () => {
    await db.delete(notes);
    await db.delete(users);
  });

  test("should return 200 when reaching root", async () => {
    const response = await fetch(`${baseUrl}`);

    expect(response.status).toBe(200);
  });

  test("should return 201 on valid note add request", async () => {
    const newNote = await addNote(mockNotes[0]!);

    expect(newNote.id).toBeString();
    expect(newNote.title).toBe(mockNotes[0]!.title);
    expect(newNote.body).toBe(mockNotes[0]!.body);
    expect(newNote.isArchived).toBe(false);
    expect(newNote.createdAt).toBeDate();
    expect(newNote.updatedAt).toBeNull();
  });

  test("should return 201 on next valid note add request", async () => {
    const newNote = await addNote(mockNotes[1]!);

    expect(newNote.id).toBeString();
    expect(newNote.title).toBe(mockNotes[1]!.title);
    expect(newNote.body).toBe(mockNotes[1]!.body);
    expect(newNote.isArchived).toBe(false);
    expect(newNote.createdAt).toBeDate();
    expect(newNote.updatedAt).toBeNull();
  });

  test("should return 200 on valid note get request", async () => {
    const notes = await getNotes();

    expect(notes).toBeArray();
    expect(notes.length).toBe(2);

    notes.forEach((note) => {
      expect(note.id).toBeString();

      const selectedNote = mockNotes.find((n) => n.title === note.title);

      expect(note.title).toBe(selectedNote!.title);
      expect(note.body).toBe(selectedNote!.body);
      expect(note.isArchived).toBe(selectedNote?.isArchived || false);
      expect(note.createdAt).toBeDate();
      expect(note.updatedAt).toBeNull();
    });

    mockNotesDB = notes;
  });

  test("should return 200 on valid get archived note request", async () => {
    await db.insert(notes).values(mockArchivedNotes);
    {
      const notes = await getNotes({ isArchived: true });

      expect(notes).toBeArray();
      expect(notes.length).toBe(2);

      notes.forEach((note) => {
        expect(note.id).toBeString();

        const selectedNote = mockArchivedNotes.find(
          (n) => n.title === note.title,
        );

        expect(note.title).toBe(selectedNote!.title);
        expect(note.body).toBe(selectedNote!.body);
        expect(note.isArchived).toBe(selectedNote?.isArchived);
        expect(note.createdAt).toBeDate();
        expect(note.updatedAt).toBeNull();
      });

      mockNotesDB.push(...notes);
    }
  });

  test("should return 200 on valid get active note request", async () => {
    const notes = await getNotes({ isArchived: false });

    expect(notes).toBeArray();
    expect(notes.length).toBe(2);

    notes.forEach((note) => {
      expect(note.id).toBeString();

      const selectedNote = mockNotesDB.find((n) => n.id === note.id);

      expect(note.title).toBe(selectedNote!.title);
      expect(note.body).toBe(selectedNote!.body);
      expect(note.isArchived).toBe(selectedNote?.isArchived);
      expect(note.createdAt).toBeDate();
      expect(note.updatedAt).toBeNull();
    });
  });

  test("should return 200 on valid get note with search string request", async () => {
    const notes = await getNotes({ searchString: "Body Test" });

    expect(notes).toBeArray();
    expect(notes.length).toBe(3);

    notes.forEach((note) => {
      expect(note.id).toBeString();

      const selectedNote = mockNotesDB.find((n) => n.id === note.id);

      expect(note.title).toBe(selectedNote!.title);
      expect(note.body).toBe(selectedNote!.body);
      expect(note.isArchived).toBe(selectedNote?.isArchived);
      expect(note.createdAt).toBeDate();
      expect(note.updatedAt).toBeNull();
    });
  });

  test("should return 200 on valid get note with another (2nd) search string request", async () => {
    const notes = await getNotes({ searchString: "slk" });

    expect(notes).toBeArray();
    expect(notes.length).toBe(2);

    notes.forEach((note) => {
      expect(note.id).toBeString();

      const selectedNote = mockNotesDB.find((n) => n.id === note.id);

      expect(note.title).toBe(selectedNote!.title);
      expect(note.body).toBe(selectedNote!.body);
      expect(note.isArchived).toBe(selectedNote?.isArchived);
      expect(note.createdAt).toBeDate();
      expect(note.updatedAt).toBeNull();
    });
  });

  test("should return 200 on valid get note with another (3nd) search string request", async () => {
    const notes = await getNotes({ searchString: "100" });

    expect(notes).toBeArray();
    expect(notes.length).toBe(1);

    notes.forEach((note) => {
      expect(note.id).toBeString();

      const selectedNote = mockNotesDB.find((n) => n.id === note.id);

      expect(note.title).toBe(selectedNote!.title);
      expect(note.body).toBe(selectedNote!.body);
      expect(note.isArchived).toBe(selectedNote?.isArchived);
      expect(note.createdAt).toBeDate();
      expect(note.updatedAt).toBeNull();
    });
  });

  test("should return 200 on valid note update request", async () => {
    const selectedNoteIdx = Math.floor(
      Math.random() * (mockNotesDB.length - 1 - 0 + 1),
    );

    const updatedNote = await updateNote({
      noteId: mockNotesDB[selectedNoteIdx]!.id,
      updatedNoteData: mockUpdatedNote,
    });

    expect(updatedNote.id).toBeString();
    expect(updatedNote.title).toBe(mockUpdatedNote?.title);
    expect(updatedNote.body).toBe(mockUpdatedNote?.body);
    expect(updatedNote.isArchived).toBe(mockUpdatedNote.isArchived);
    expect(updatedNote.createdAt).toBeDate();
    // TODO: fix the so that this will behave properly
    // expect(updatedNote.updatedAt).toBeDate()

    const notes = await getNotes();

    expect(notes).toBeArray();
    expect(notes.length).toBe(mockNotesDB.length);

    notes
      .filter((note) => note.id !== mockNotesDB[selectedNoteIdx]?.id)
      .forEach((note) => {
        expect(note.id).toBeString();

        const selectedNote = mockNotesDB.find((n) => n.id === note.id);

        expect(note.title).toBe(selectedNote!.title);
        expect(note.body).toBe(selectedNote!.body);
        expect(note.isArchived).toBe(selectedNote?.isArchived || false);
        expect(note.createdAt).toBeDate();
        expect(note.updatedAt).toBeNull();
      });

    mockNotesDB = notes;
  });

  test("should return 200 on valid note delete request", async () => {
    const selectedNoteIdx = Math.floor(
      Math.random() * (mockNotesDB.length - 1 - 0 + 1),
    );

    const deletedNote = await deleteNote({
      noteId: mockNotesDB[selectedNoteIdx]!.id,
    });

    expect(deletedNote.id).toBeString();
    expect(deletedNote.title).toBe(mockNotesDB[selectedNoteIdx]!.title);

    const notes = await getNotes();

    expect(notes).toBeArray();
    expect(notes.length).toBe(mockNotesDB.length - 1);

    notes
      .filter((note) => note.id !== mockNotesDB[selectedNoteIdx]?.id)
      .forEach((note) => {
        expect(note.id).toBeString();

        const selectedNote = mockNotesDB.find((n) => n.id === note.id);

        expect(note.title).toBe(selectedNote!.title);
        expect(note.body).toBe(selectedNote!.body);
        expect(note.isArchived).toBe(selectedNote?.isArchived || false);
        expect(note.createdAt).toBeDate();
        expect(note.updatedAt).toBeNull();
      });

    expect(
      notes.filter((note: any) => note.id === mockNotesDB[selectedNoteIdx]?.id)
        .length,
    ).toBe(0);

    mockNotesDB = notes;
  });
});
