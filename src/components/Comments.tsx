import { FunctionalComponent, h } from "preact";

import type { Comment } from "../model/types";
import { CommentVoteCounter } from "./VoteCounter";
import { CommentProfileCard } from "./ProfileCard";
import { ReplyIcon } from "@heroicons/react/outline";
import { useCallback, useState } from "preact/compat";
import { createComment } from "../actions/Comment";
import CommentDialog, { Values } from "./inputs/CommentDialog";

type CommentProps = {
  comment: Comment;
  postId: number;
};

const CommentComponent = ({ comment, postId }: CommentProps) => {
  const [isReplying, setIsReplying] = useState(false);
  const onReplySubmit = useCallback(
    async (values: Values) => {
      const newComment = await createComment(postId, {
        parentCommentId: comment.id,
        ...values,
      });
      setIsReplying(false);
      comment.children = [...comment.children, newComment];
    },
    [comment, postId]
  );

  return (
    <div>
      <div class="flex">
        <div>
          <CommentVoteCounter comment={comment} />
        </div>
        <div>
          <CommentProfileCard user={comment.creator} />
          <div>{comment.content}</div>
          <div>
            <span onClick={() => setIsReplying(true)}>
              {/*Create a common class for buttons*/}
              <ReplyIcon width="20" height="20" className="inline-block" />
              Reply
            </span>
          </div>
        </div>
      </div>
      {isReplying && <CommentDialog onSubmit={onReplySubmit} />}
      {comment.children.length > 0 && (
        // TODO: Alternate border color between different levels of nesting
        <div class="m-6 p-2 border-l border-secondary-100">
          {comment.children && (
            <Comments comments={comment.children} postId={postId} />
          )}
        </div>
      )}
    </div>
  );
};

type CommentsProps = {
  comments: Comment[];
  postId: number;
};

const Comments = ({ comments, postId }: CommentsProps) => {
  return (
    <div>
      <div class="space-y-4">
        {comments.map((comment) => (
          <div>
            <CommentComponent comment={comment} postId={postId} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comments;
