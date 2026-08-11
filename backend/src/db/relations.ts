import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
  users: {
    notes: r.many.notes({
      from: r.users.id,
      to: r.notes.authorId,
    }),
    tags: r.many.tags({
      from: r.users.id,
      to: r.tags.ownerId,
    }),
    refreshTokens: r.many.refreshTokens({
      from: r.users.id,
      to: r.refreshTokens.ownerId,
    }),
  },
  tags: {
    owner: r.one.users({
      from: r.tags.ownerId,
      to: r.users.id,
      optional: false,
    }),
    notes: r.many.notes({
      from: r.tags.id.through(r.noteTags.tagId),
      to: r.notes.id.through(r.noteTags.noteId),
    }),
  },
  notes: {
    author: r.one.users({
      from: r.notes.authorId,
      to: r.users.id,
      optional: false,
    }),
    tags: r.many.tags({
      from: r.notes.id.through(r.noteTags.noteId),
      to: r.tags.id.through(r.noteTags.tagId),
    }),
  },
  refreshTokens: {
    owner: r.one.users({
      from: r.refreshTokens.ownerId,
      to: r.users.id,
      optional: false,
    }),
  },
}));
