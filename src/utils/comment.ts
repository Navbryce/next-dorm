// TODO: Shim for all community
import { Comment, Status } from "src/types/types";
import { REMOVED_CONTENT_USER } from "src/model/user";

// standardizes deleted comments for front
export function generateDeletedCommentFrom(comment: Comment): Comment {
  return {
    ...comment,
    id: comment.id,
    content: "Deleted",
    children: comment.children,
    creator: REMOVED_CONTENT_USER,
    status: Status.DELETED,
  };
}
