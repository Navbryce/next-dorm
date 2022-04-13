import { h } from "preact";

import type { Comment, StateProps } from "../types/types";
import { CommentVoteCounter } from "./VoteCounter";
import { CommentProfileCard } from "./ProfileCard";
import { ChatIcon } from "@heroicons/react/outline";
import { useCallback, useContext, useState } from "preact/compat";
import { createComment } from "../actions/Comment";
import CommentDialog, { Values } from "./inputs/CommentDialog";
import { IconButton } from "src/components/inputs/Button";
import { UserContext } from "src/contexts";

type HasReplyLock = StateProps<{ commentWithReplyLock: number | null }>;

type CommentProps = {
  comment: Comment;
  postId: number;
} & HasReplyLock;

const CommentComponent = ({
  comment,
  postId,
  commentWithReplyLock,
  setCommentWithReplyLock,
}: CommentProps) => {
  const [user] = useContext(UserContext);
  const [commentContent, setCommentContent] = useState("");

  const onStartReply = useCallback(() => {
    setCommentWithReplyLock(
      commentWithReplyLock != comment.id ? comment.id : null
    );
  }, [comment, commentWithReplyLock, setCommentWithReplyLock]);

  const onReplySubmit = useCallback(
    async (values: Values) => {
      if (!user) {
        throw new Error("must be logged in to comment");
      }
      const newComment = await createComment(user, postId, {
        parentCommentId: comment.id,
        ...values,
      });
      setCommentWithReplyLock(null);
      setCommentContent("");
      comment.children = [...comment.children, newComment];
    },
    [comment, postId, setCommentContent, setCommentWithReplyLock]
  );

  const onReplyCancel = useCallback(async () => {
    setCommentWithReplyLock(null);
    setCommentContent("");
  }, [setCommentContent, setCommentWithReplyLock]);

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
            <span onClick={onStartReply}>
              {/*Create a common class for buttons*/}
              <IconButton buttonType="text" startIcon={<ChatIcon />}>
                Comment
              </IconButton>
            </span>
          </div>
        </div>
      </div>
      {commentWithReplyLock == comment.id && (
        <CommentDialog
          content={commentContent}
          setContent={setCommentContent}
          onSubmit={onReplySubmit}
          onCancel={onReplyCancel}
        />
      )}
      {comment.children.length > 0 && (
        // TODO: Alternate border color between different levels of nesting
        <div class="m-6 p-2 border-l border-secondary-100">
          {comment.children && (
            <Comments
              comments={comment.children}
              postId={postId}
              commentWithReplyLock={commentWithReplyLock}
              setCommentWithReplyLock={setCommentWithReplyLock}
            />
          )}
        </div>
      )}
    </div>
  );
};

type CommentsProps = {
  comments: Comment[];
  postId: number;
} & HasReplyLock;

const Comments = ({
  comments,
  postId,
  commentWithReplyLock,
  setCommentWithReplyLock,
}: CommentsProps) => {
  return (
    <div>
      <div class="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id}>
            <CommentComponent
              comment={comment}
              postId={postId}
              commentWithReplyLock={commentWithReplyLock}
              setCommentWithReplyLock={setCommentWithReplyLock}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comments;
