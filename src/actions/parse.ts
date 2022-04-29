import {
  CommentRes,
  Comment,
  ContentMetadata,
  ContentMetadataRes,
  PostCursor,
  PostRes,
} from "src/types/types";
import { toDisplayableUser } from "src/utils/user";
import dayjs from "dayjs";

export function parseTime(time: number) {
  return dayjs(time);
}

export function makeCMDisplayable<T extends ContentMetadataRes>(
  res: T
): T & ContentMetadata {
  return {
    ...res,
    creator: toDisplayableUser(res.creator),
    createdAt: parseTime(res.createdAt),
    updatedAt: parseTime(res.updatedAt),
  };
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

export function makeCommentDisplayable(comment: CommentRes): Comment {
  return {
    ...makeCMDisplayable(comment),
    children: comment.children.map(makeCommentDisplayable),
  };
}
