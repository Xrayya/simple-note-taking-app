import { BaseError } from "./base";

export class NoteNotFoundError extends BaseError {
  constructor(noteId: string) {
    super("NoteNotFoundError", `Note with ID '${noteId} not found'`, 404);
  }
}
