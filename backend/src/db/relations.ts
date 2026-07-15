import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
  users: {
    notes: r.many.notes({
      from: r.users.id,
      to: r.notes.authorId,
    }),
    refreshTokens: r.many.refreshTokens({
      from: r.users.id,
      to: r.refreshTokens.ownerId,
    }),
  },
  notes: {
    author: r.one.users({
      from: r.notes.authorId,
      to: r.users.id,
      optional: false
    }),
  },
  refreshTokens: {
    owner: r.one.users({
      from: r.refreshTokens.ownerId,
      to: r.users.id,
      optional: false
    }),
  },
}));
