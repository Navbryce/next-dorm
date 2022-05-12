import {
  CommentRes,
  Comment,
  ContentMetadata,
  ContentMetadataRes,
  PostCursor,
  PostRes,
  Status,
} from "src/types/types";
import { parseContentAuthorRes } from "src/actions/user-parse";
import dayjs from "dayjs";
import { generateDeletedCommentFrom } from "src/utils/comment";

export function parseTime(time: number) {
  return dayjs(time);
}

export function makeCMDisplayable<T extends ContentMetadataRes>(
  res: T
): T & ContentMetadata {
  return {
    ...res,
    creator: parseContentAuthorRes(res.creator),
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
  const displayableComment = {
    ...makeCMDisplayable(comment),
    children: comment.children.map(makeCommentDisplayable),
  };
  // standardize deleted comments for display purposes (change the content to placeholder)
  return displayableComment.status == Status.POSTED
    ? displayableComment
    : generateDeletedCommentFrom(displayableComment);
}
