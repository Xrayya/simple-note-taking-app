import {
  afterAll,
  beforeAll,
  describe,
  expect,
  setDefaultTimeout,
  test,
} from "bun:test";
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

setDefaultTimeout(20000);

let mockUser: typeof users.$inferInsert = {
  username: "bambang",
  email: "bambang@example.com",
  passwordHash: "mockpassword",
};

let mockUser2: typeof users.$inferInsert = {
  username: "test2",
  email: "test2@gmail.com",
  passwordHash: "mockpassword",
};

const mockNotes: InputNoteType[] = [
  {
    title: "Test Note 1",
    body: "Note Body Test 1; lorem ipsum; bla bla",
  },
  {
    title: "Test Note 2",
    body: "Note Body Test 2; babb al wlkj slk ejekjejdk",
  },
];

const mockArchivedNotes: InputNoteType[] = [
  {
    title: "Test Note 3",
    body: "lkasd as;lkdf asdfdfl;kjj asdkdlfj alksd jf;ka sdkfj ;aksld f;ka jsdkfk ;askd f;ak sdl;fja;sdk fas d",
    isArchived: true,
  },
  {
    title: "Test Note 100",
    body: "Note Body Test 2; babb al wlkj slk ejekjejdk ;alk a askldj l;ewl;jk askd f;ljkasassd;lf ewwldosnwoefn wfoe fwoe",
    isArchived: true,
  },
];

const mockUpdatedNote: InputNoteType = {
  title: "Updated Test Note Title",
  body: "Updated Test Note Body",
  isArchived: true,
};

let mockNotesDB: ReturnedNoteType[] = [];

describe("Notes service [User 1]", () => {
  beforeAll(async () => {
    mockUser = (
      await db
        .insert(users)
        .values({ ...mockUser })
        .returning()
    )[0]!;
  });

  afterAll(async () => {
    await db.delete(notes);
    await db.delete(users);
  });

  test("should perform proper add note", async () => {
    const newNote = await addNote(mockUser.id!, mockNotes[0]!);

    expect(newNote.id).toBeString();
    expect(newNote.title).toBe(mockNotes[0]!.title);
    expect(newNote.body).toBe(mockNotes[0]!.body);
    expect(newNote.isArchived).toBe(false);
    expect(newNote.authorId).toBe(mockUser.id!);
    expect(newNote.createdAt).toBeDate();
    expect(newNote.updatedAt).toBeNull();
  });

  test("should perform proper another add note", async () => {
    const newNote = await addNote(mockUser.id!, mockNotes[1]!);

    expect(newNote.id).toBeString();
    expect(newNote.title).toBe(mockNotes[1]!.title);
    expect(newNote.body).toBe(mockNotes[1]!.body);
    expect(newNote.isArchived).toBe(false);
    expect(newNote.authorId).toBe(mockUser.id!);
    expect(newNote.createdAt).toBeDate();
    expect(newNote.updatedAt).toBeNull();
  });

  test("should perform proper get all notes", async () => {
    const notes = await getNotes(mockUser.id!);

    expect(notes).toBeArray();
    expect(notes.length).toBe(2);

    notes.forEach((note) => {
      expect(note.id).toBeString();

      const selectedNote = mockNotes.find((n) => n.title === note.title);

      expect(note.title).toBe(selectedNote!.title);
      expect(note.body).toBe(selectedNote!.body);
      expect(note.isArchived).toBe(selectedNote?.isArchived || false);
      expect(note.authorId).toBe(mockUser.id!);
      expect(note.createdAt).toBeDate();
      expect(note.updatedAt).toBeNull();
    });

    mockNotesDB = notes;
  });

  test("should perform proper get all notes with isArchived=true fiter", async () => {
    await db.insert(notes).values(
      mockArchivedNotes.map((note) => ({
        ...note,
        authorId: mockUser.id!,
      })),
    );
    {
      const notes = await getNotes(mockUser.id!, { isArchived: true });

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
        expect(note.authorId).toBe(mockUser.id!);
        expect(note.createdAt).toBeDate();
        expect(note.updatedAt).toBeNull();
      });

      mockNotesDB.push(...notes);
    }
  });

  test("should perform proper get all notes with isArchived=false filter", async () => {
    const notes = await getNotes(mockUser.id!, { isArchived: false });

    expect(notes).toBeArray();
    expect(notes.length).toBe(2);

    notes.forEach((note) => {
      expect(note.id).toBeString();

      const selectedNote = mockNotesDB.find((n) => n.id === note.id);

      expect(note.title).toBe(selectedNote!.title);
      expect(note.body).toBe(selectedNote!.body);
      expect(note.isArchived).toBe(selectedNote?.isArchived);
      expect(note.authorId).toBe(mockUser.id!);
      expect(note.createdAt).toBeDate();
      expect(note.updatedAt).toBeNull();
    });
  });

  test("should perform proper get all notes with searchString filter", async () => {
    const notes = await getNotes(mockUser.id!, { searchString: "Body Test" });

    expect(notes).toBeArray();
    expect(notes.length).toBe(3);

    notes.forEach((note) => {
      expect(note.id).toBeString();

      const selectedNote = mockNotesDB.find((n) => n.id === note.id);

      expect(note.title).toBe(selectedNote!.title);
      expect(note.body).toBe(selectedNote!.body);
      expect(note.isArchived).toBe(selectedNote?.isArchived);
      expect(note.authorId).toBe(mockUser.id!);
      expect(note.createdAt).toBeDate();
      expect(note.updatedAt).toBeNull();
    });
  });

  test("should perform proper get all notes with another searchString filter", async () => {
    const notes = await getNotes(mockUser.id!, { searchString: "slk" });

    expect(notes).toBeArray();
    expect(notes.length).toBe(2);

    notes.forEach((note) => {
      expect(note.id).toBeString();

      const selectedNote = mockNotesDB.find((n) => n.id === note.id);

      expect(note.title).toBe(selectedNote!.title);
      expect(note.body).toBe(selectedNote!.body);
      expect(note.isArchived).toBe(selectedNote?.isArchived);
      expect(note.authorId).toBe(mockUser.id!);
      expect(note.createdAt).toBeDate();
      expect(note.updatedAt).toBeNull();
    });
  });

  test("should perform proper get all notes with another (again) searchString filter", async () => {
    const notes = await getNotes(mockUser.id!, { searchString: "100" });

    expect(notes).toBeArray();
    expect(notes.length).toBe(1);

    notes.forEach((note) => {
      expect(note.id).toBeString();

      const selectedNote = mockNotesDB.find((n) => n.id === note.id);

      expect(note.title).toBe(selectedNote!.title);
      expect(note.body).toBe(selectedNote!.body);
      expect(note.isArchived).toBe(selectedNote?.isArchived);
      expect(note.authorId).toBe(mockUser.id!);
      expect(note.createdAt).toBeDate();
      expect(note.updatedAt).toBeNull();
    });
  });

  test("should perform proper update note", async () => {
    const selectedNoteIdx = Math.floor(
      Math.random() * (mockNotesDB.length - 1 - 0 + 1),
    );

    const updatedNote = await updateNote(mockUser.id!, {
      noteId: mockNotesDB[selectedNoteIdx]!.id,
      updatedNoteData: mockUpdatedNote,
    });

    expect(updatedNote.id).toBeString();
    expect(updatedNote.title).toBe(mockUpdatedNote?.title);
    expect(updatedNote.body).toBe(mockUpdatedNote?.body);
    expect(updatedNote.isArchived).toBe(mockUpdatedNote.isArchived);
    expect(updatedNote.authorId).toBe(mockUser.id!);
    expect(updatedNote.createdAt).toBeDate();
    // TODO: fix the so that this will behave properly
    // expect(updatedNote.updatedAt).toBeDate()

    const notes = await getNotes(mockUser.id!);

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
        expect(note.authorId).toBe(mockUser.id!);
        expect(note.createdAt).toBeDate();
        expect(note.updatedAt).toBeNull();
      });

    mockNotesDB = notes;
  });

  test("should perform proper delete note", async () => {
    const selectedNoteIdx = Math.floor(
      Math.random() * (mockNotesDB.length - 1 - 0 + 1),
    );

    const deletedNote = await deleteNote(mockUser.id!, {
      noteId: mockNotesDB[selectedNoteIdx]!.id,
    });

    expect(deletedNote.id).toBeString();
    expect(deletedNote.title).toBe(mockNotesDB[selectedNoteIdx]!.title);

    const notes = await getNotes(mockUser.id!);

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
        expect(note.authorId).toBe(mockUser.id!);
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

describe("Notes service [User 2]", () => {
  beforeAll(async () => {
    mockUser2 = (
      await db
        .insert(users)
        .values({ ...mockUser2 })
        .returning()
    )[0]!;
  });

  afterAll(async () => {
    await db.delete(notes);
    await db.delete(users);
  });

  test("should perform proper add note", async () => {
    const newNote = await addNote(mockUser2.id!, mockNotes[0]!);

    expect(newNote.id).toBeString();
    expect(newNote.title).toBe(mockNotes[0]!.title);
    expect(newNote.body).toBe(mockNotes[0]!.body);
    expect(newNote.isArchived).toBe(false);
    expect(newNote.authorId).toBe(mockUser2.id!);
    expect(newNote.createdAt).toBeDate();
    expect(newNote.updatedAt).toBeNull();
  });

  test("should perform proper another add note", async () => {
    const newNote = await addNote(mockUser2.id!, mockNotes[1]!);

    expect(newNote.id).toBeString();
    expect(newNote.title).toBe(mockNotes[1]!.title);
    expect(newNote.body).toBe(mockNotes[1]!.body);
    expect(newNote.isArchived).toBe(false);
    expect(newNote.authorId).toBe(mockUser2.id!);
    expect(newNote.createdAt).toBeDate();
    expect(newNote.updatedAt).toBeNull();
  });

  test("should perform proper get all notes", async () => {
    const notes = await getNotes(mockUser2.id!);

    expect(notes).toBeArray();
    expect(notes.length).toBe(2);

    notes.forEach((note) => {
      expect(note.id).toBeString();

      const selectedNote = mockNotes.find((n) => n.title === note.title);

      expect(note.title).toBe(selectedNote!.title);
      expect(note.body).toBe(selectedNote!.body);
      expect(note.isArchived).toBe(selectedNote?.isArchived || false);
      expect(note.authorId).toBe(mockUser2.id!);
      expect(note.createdAt).toBeDate();
      expect(note.updatedAt).toBeNull();
    });

    mockNotesDB = notes;
  });

  test("should perform proper get all notes with isArchived=true fiter", async () => {
    await db.insert(notes).values(
      mockArchivedNotes.map((note) => ({
        ...note,
        authorId: mockUser2.id!,
      })),
    );
    {
      const notes = await getNotes(mockUser2.id!, { isArchived: true });

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
        expect(note.authorId).toBe(mockUser2.id!);
        expect(note.createdAt).toBeDate();
        expect(note.updatedAt).toBeNull();
      });

      mockNotesDB.push(...notes);
    }
  });

  test("should perform proper get all notes with isArchived=false filter", async () => {
    const notes = await getNotes(mockUser2.id!, { isArchived: false });

    expect(notes).toBeArray();
    expect(notes.length).toBe(2);

    notes.forEach((note) => {
      expect(note.id).toBeString();

      const selectedNote = mockNotesDB.find((n) => n.id === note.id);

      expect(note.title).toBe(selectedNote!.title);
      expect(note.body).toBe(selectedNote!.body);
      expect(note.isArchived).toBe(selectedNote?.isArchived);
      expect(note.authorId).toBe(mockUser2.id!);
      expect(note.createdAt).toBeDate();
      expect(note.updatedAt).toBeNull();
    });
  });

  test("should perform proper get all notes with searchString filter", async () => {
    const notes = await getNotes(mockUser2.id!, { searchString: "Body Test" });

    expect(notes).toBeArray();
    expect(notes.length).toBe(3);

    notes.forEach((note) => {
      expect(note.id).toBeString();

      const selectedNote = mockNotesDB.find((n) => n.id === note.id);

      expect(note.title).toBe(selectedNote!.title);
      expect(note.body).toBe(selectedNote!.body);
      expect(note.isArchived).toBe(selectedNote?.isArchived);
      expect(note.authorId).toBe(mockUser2.id!);
      expect(note.createdAt).toBeDate();
      expect(note.updatedAt).toBeNull();
    });
  });

  test("should perform proper get all notes with another searchString filter", async () => {
    const notes = await getNotes(mockUser2.id!, { searchString: "slk" });

    expect(notes).toBeArray();
    expect(notes.length).toBe(2);

    notes.forEach((note) => {
      expect(note.id).toBeString();

      const selectedNote = mockNotesDB.find((n) => n.id === note.id);

      expect(note.title).toBe(selectedNote!.title);
      expect(note.body).toBe(selectedNote!.body);
      expect(note.isArchived).toBe(selectedNote?.isArchived);
      expect(note.authorId).toBe(mockUser2.id!);
      expect(note.createdAt).toBeDate();
      expect(note.updatedAt).toBeNull();
    });
  });

  test("should perform proper get all notes with another (again) searchString filter", async () => {
    const notes = await getNotes(mockUser2.id!, { searchString: "100" });

    expect(notes).toBeArray();
    expect(notes.length).toBe(1);

    notes.forEach((note) => {
      expect(note.id).toBeString();

      const selectedNote = mockNotesDB.find((n) => n.id === note.id);

      expect(note.title).toBe(selectedNote!.title);
      expect(note.body).toBe(selectedNote!.body);
      expect(note.isArchived).toBe(selectedNote?.isArchived);
      expect(note.authorId).toBe(mockUser2.id!);
      expect(note.createdAt).toBeDate();
      expect(note.updatedAt).toBeNull();
    });
  });

  test("should perform proper update note", async () => {
    const selectedNoteIdx = Math.floor(
      Math.random() * (mockNotesDB.length - 1 - 0 + 1),
    );

    const updatedNote = await updateNote(mockUser2.id!, {
      noteId: mockNotesDB[selectedNoteIdx]!.id,
      updatedNoteData: mockUpdatedNote,
    });

    expect(updatedNote.id).toBeString();
    expect(updatedNote.title).toBe(mockUpdatedNote?.title);
    expect(updatedNote.body).toBe(mockUpdatedNote?.body);
    expect(updatedNote.isArchived).toBe(mockUpdatedNote.isArchived);
    expect(updatedNote.authorId).toBe(mockUser2.id!);
    expect(updatedNote.createdAt).toBeDate();
    // TODO: fix the so that this will behave properly
    // expect(updatedNote.updatedAt).toBeDate()

    const notes = await getNotes(mockUser2.id!);

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
        expect(note.authorId).toBe(mockUser2.id!);
        expect(note.createdAt).toBeDate();
        expect(note.updatedAt).toBeNull();
      });

    mockNotesDB = notes;
  });

  test("should perform proper delete note", async () => {
    const selectedNoteIdx = Math.floor(
      Math.random() * (mockNotesDB.length - 1 - 0 + 1),
    );

    const deletedNote = await deleteNote(mockUser2.id!, {
      noteId: mockNotesDB[selectedNoteIdx]!.id,
    });

    expect(deletedNote.id).toBeString();
    expect(deletedNote.title).toBe(mockNotesDB[selectedNoteIdx]!.title);

    const notes = await getNotes(mockUser2.id!);

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
        expect(note.authorId).toBe(mockUser2.id!);
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
