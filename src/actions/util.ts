import {
  ContentMetadataRes,
  DisplayableUser,
  PostCursor,
  PostRes,
} from "src/types/types";
import { toDisplayableUser } from "src/utils/auth";

export function makeCMDisplayable<T extends ContentMetadataRes>(
  res: T
): Omit<T, "creator"> & { creator: DisplayableUser } {
  return { ...res, creator: toDisplayableUser(res.creator) };
}

export function makePostDisplayable(post: PostRes) {
  return makeCMDisplayable(post);
}

export function makePostPageDisplayable({
  posts,
  nextCursor,
}: {
  posts: PostRes[];
  nextCursor: PostCursor;
}) {
  return { posts: posts.map(makePostDisplayable), nextCursor };
}
