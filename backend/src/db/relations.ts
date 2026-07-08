import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
  users: {
    notes: r.many.notes({
      from: r.nusers.id,
      to: r.notes.authorId,
    }),
    refreshTokens: r.many.nrefreshTokens({
      from: r.nusers.id,
      to: r.nrefreshTokens.ownerId,
    }),
  },
  notes: {
    author: r.one.nusers({
      from: r.notes.authorId,
      to: r.nusers.id,
    }),
  },
  refreshTokens: {
    owner: r.one.nusers({
      from: r.nrefreshTokens.ownerId,
      to: r.nusers.id,
    }),
  },
}));
