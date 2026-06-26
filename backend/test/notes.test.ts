import { describe, afterAll, test, expect } from "bun:test";
import { db } from "../src/db/db";
import { notes } from "../src/db/schema";
import type { InputNoteType, ReturnedNoteType } from "../src/services/notes";

const baseUrl = "http://localhost:3000";

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

describe("Notes", () => {
  afterAll(async () => {
    await db.delete(notes);
  });

  test("should return 200 when reaching root", async () => {
    const response = await fetch(`${baseUrl}`);

    expect(response.status).toBe(200);
  });

  test("should return 201 on valid note add request", async () => {
    const response = await fetch(`${baseUrl}/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...mockNotes[0],
      }),
    });

    expect(response.status).toBe(201);

    const payload: any = await response.json();

    expect(payload.newNote.id).toBeString();
    expect(payload.newNote.title).toBe(mockNotes[0]?.title);
    expect(payload.newNote.body).toBe(mockNotes[0]?.body);
    expect(payload.newNote.isArchived).toBe(false);
    expect(Date.parse(payload.newNote.createdAt)).not.toBeNaN();
    expect(payload.newNote.updatedAt).toBeNull();
  });

  test("should return 201 on next valid note add request", async () => {
    const response = await fetch(`${baseUrl}/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...mockNotes[1],
      }),
    });

    expect(response.status).toBe(201);

    const payload: any = await response.json();

    expect(payload.newNote.id).toBeString();
    expect(payload.newNote.title).toBe(mockNotes[1]?.title);
    expect(payload.newNote.body).toBe(mockNotes[1]?.body);
    expect(payload.newNote.isArchived).toBe(false);
    expect(Date.parse(payload.newNote.createdAt)).not.toBeNaN();
    expect(payload.newNote.updatedAt).toBeNull();
  });

  test("should return 200 on valid note get request", async () => {
    const response = await fetch(`${baseUrl}/notes`);

    expect(response.status).toBe(200);

    const payload: any = await response.json();

    expect(payload.notes).toBeArray();
    expect(payload.notes.length).toBe(2);

    payload.notes.forEach((note: any) => {
      expect(note.id).toBeString();

      const selectedNote = mockNotes.find((n) => n.title === note.title);

      expect(note.title).toBe(selectedNote?.title);
      expect(note.body).toBe(selectedNote?.body);
      expect(note.isArchived).toBe(selectedNote?.isArchived || false);
      expect(Date.parse(note.createdAt)).not.toBeNaN();
      expect(note.updatedAt).toBeNull();
    });

    mockNotesDB = payload.notes;
  });

  test("should return 200 on valid get archived note request", async () => {
    await db.insert(notes).values(mockArchivedNotes);

    const response = await fetch(`${baseUrl}/notes?isArchived=true`);

    expect(response.status).toBe(200);

    const payload: any = await response.json();

    expect(payload.notes).toBeArray();
    expect(payload.notes.length).toBe(2);

    payload.notes.forEach((note: any) => {
      expect(note.id).toBeString();

      const selectedNote = mockArchivedNotes.find(
        (n) => n.title === note.title,
      );

      expect(note.title).toBe(selectedNote?.title);
      expect(note.body).toBe(selectedNote?.body);
      expect(note.isArchived).toBe(selectedNote?.isArchived);
      expect(Date.parse(note.createdAt)).not.toBeNaN();
      expect(note.updatedAt).toBeNull();
    });

    mockNotesDB.push(...payload.notes);
  });

  test("should return 200 on valid get active note request", async () => {
    const response = await fetch(`${baseUrl}/notes?isArchived=false`);

    expect(response.status).toBe(200);

    const payload: any = await response.json();

    expect(payload.notes).toBeArray();
    expect(payload.notes.length).toBe(2);

    payload.notes.forEach((note: any) => {
      expect(note.id).toBeString();

      const selectedNote = mockNotesDB.find((n) => n.id === note.id);

      expect(note.title).toBe(selectedNote?.title);
      expect(note.body).toBe(selectedNote?.body);
      expect(note.isArchived).toBe(selectedNote?.isArchived);
      expect(Date.parse(note.createdAt)).not.toBeNaN();
      expect(note.updatedAt).toBeNull();
    });
  });

  test("should return 200 on valid get note with search string request", async () => {
    const response = await fetch(`${baseUrl}/notes?searchString=Body Test`);

    expect(response.status).toBe(200);

    const payload: any = await response.json();

    expect(payload.notes).toBeArray();
    expect(payload.notes.length).toBe(3);

    payload.notes.forEach((note: any) => {
      expect(note.id).toBeString();

      const selectedNote = mockNotesDB.find((n) => n.id === note.id);

      expect(note.title).toBe(selectedNote?.title);
      expect(note.body).toBe(selectedNote?.body);
      expect(note.isArchived).toBe(selectedNote?.isArchived);
      expect(Date.parse(note.createdAt)).not.toBeNaN();
      expect(note.updatedAt).toBeNull();
    });
  });

  test("should return 200 on valid get note with another (2nd) search string request", async () => {
    const response = await fetch(`${baseUrl}/notes?searchString=slk`);

    expect(response.status).toBe(200);

    const payload: any = await response.json();

    expect(payload.notes).toBeArray();
    expect(payload.notes.length).toBe(2);

    payload.notes.forEach((note: any) => {
      expect(note.id).toBeString();

      const selectedNote = mockNotesDB.find((n) => n.id === note.id);

      expect(note.title).toBe(selectedNote?.title);
      expect(note.body).toBe(selectedNote?.body);
      expect(note.isArchived).toBe(selectedNote?.isArchived);
      expect(Date.parse(note.createdAt)).not.toBeNaN();
      expect(note.updatedAt).toBeNull();
    });
  });

  test("should return 200 on valid get note with another (3nd) search string request", async () => {
    const response = await fetch(`${baseUrl}/notes?searchString=100`);

    expect(response.status).toBe(200);

    const payload: any = await response.json();

    expect(payload.notes).toBeArray();
    expect(payload.notes.length).toBe(1);

    payload.notes.forEach((note: any) => {
      expect(note.id).toBeString();

      const selectedNote = mockNotesDB.find((n) => n.id === note.id);

      expect(note.title).toBe(selectedNote?.title);
      expect(note.body).toBe(selectedNote?.body);
      expect(note.isArchived).toBe(selectedNote?.isArchived);
      expect(Date.parse(note.createdAt)).not.toBeNaN();
      expect(note.updatedAt).toBeNull();
    });
  });

  test("should return 200 on valid note update request", async () => {
    const selectedNoteIdx = Math.floor(
      Math.random() * (mockNotesDB.length - 1 - 0 + 1),
    );

    const response = await fetch(
      `${baseUrl}/notes/${mockNotesDB[selectedNoteIdx]?.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...mockUpdatedNote,
        }),
      },
    );

    expect(response.status).toBe(200);

    const payload: any = await response.json();

    expect(payload.updatedNote.id).toBeString();
    expect(payload.updatedNote.title).toBe(mockUpdatedNote?.title);
    expect(payload.updatedNote.body).toBe(mockUpdatedNote?.body);
    expect(payload.updatedNote.isArchived).toBe(mockUpdatedNote.isArchived);
    expect(Date.parse(payload.updatedNote.createdAt)).not.toBeNaN();
    // TODO: fix the so that this will behave properly
    // expect(Date.parse(payload.updatedNote.updatedAt)).not.toBeNaN();

    const response2 = await fetch(`${baseUrl}/notes`);

    expect(response2.status).toBe(200);

    const payload2: any = await response2.json();

    expect(payload2.notes).toBeArray();
    expect(payload2.notes.length).toBe(mockNotesDB.length);

    payload2.notes
      .filter((note: any) => note.id !== mockNotesDB[selectedNoteIdx]?.id)
      .forEach((note: any) => {
        expect(note.id).toBeString();

        const selectedNote = mockNotesDB.find((n) => n.id === note.id);

        expect(note.title).toBe(selectedNote?.title);
        expect(note.body).toBe(selectedNote?.body);
        expect(note.isArchived).toBe(selectedNote?.isArchived || false);
        expect(Date.parse(note.createdAt)).not.toBeNaN();
        expect(note.updatedAt).toBeNull();
      });

    mockNotesDB = payload2.notes;
  });

  test("should return 200 on valid note delete request", async () => {
    const selectedNoteIdx = Math.floor(
      Math.random() * (mockNotesDB.length - 1 - 0 + 1),
    );

    const response = await fetch(
      `${baseUrl}/notes/${mockNotesDB[selectedNoteIdx]?.id}`,
      {
        method: "DELETE",
      },
    );

    expect(response.status).toBe(200);

    const payload: any = await response.json();

    expect(payload.deletedNote.id).toBeString();
    expect(payload.deletedNote.title).toBe(mockNotesDB[selectedNoteIdx]?.title);

    const response2 = await fetch(`${baseUrl}/notes`);

    expect(response2.status).toBe(200);

    const payload2: any = await response2.json();

    expect(payload2.notes).toBeArray();
    expect(payload2.notes.length).toBe(mockNotesDB.length - 1);

    payload2.notes
      .filter((note: any) => note.id !== mockNotesDB[selectedNoteIdx]?.id)
      .forEach((note: any) => {
        expect(note.id).toBeString();

        const selectedNote = mockNotesDB.find((n) => n.id === note.id);

        expect(note.title).toBe(selectedNote?.title);
        expect(note.body).toBe(selectedNote?.body);
        expect(note.isArchived).toBe(selectedNote?.isArchived || false);
        expect(Date.parse(note.createdAt)).not.toBeNaN();
        expect(note.updatedAt).toBeNull();
      });

    expect(
      payload2.notes.filter(
        (note: any) => note.id === mockNotesDB[selectedNoteIdx]?.id,
      ).length,
    ).toBe(0);

    mockNotesDB = payload2.notes;
  });
});
