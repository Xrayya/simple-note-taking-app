import { db } from "../db/db";
import { tags } from "../db/schema";

export async function addTag(
  userId: string,
  { tagName }: { tagName: string },
): Promise<{ id: string; tagName: string }> {
  const result = await db
    .insert(tags)
    .values({
      ownerId: userId,
      tagName,
    })
    .returning({
      id: tags.id,
      tagName: tags.tagName,
    });

  return result[0]!;
}
