import { Fragment } from "preact";

import type { Comment, Creator, StateProps, Status } from "../types/types";
import { CommentVoteCounter } from "./VoteCounter";
import { ProfileCardSm } from "./ProfileCard";
import { ChatIcon } from "@heroicons/react/outline";
import { useCallback, useContext, useState } from "preact/compat";
import { createComment, deleteComment, editComment } from "../actions/Comment";
import CommentDialog, { Values } from "./inputs/CommentDialog";
import { IconButton } from "src/components/inputs/Button";
import { UserContext } from "src/contexts";
import { timeToDisplayStr } from "src/utils/display";
import { diff } from "src/utils/diff";
import update from "immutability-helper";
import { DocumentRemoveIcon, PencilIcon } from "@heroicons/react/solid";
import { generateDeletedCommentFrom } from "src/utils/comment";

type HasReplyLock = StateProps<{ commentWithReplyLock: number | null }>;

type CommentProps = {
  comment: Comment;
  postId: number;
  onDelete: () => void;
} & HasReplyLock;

const CommentComponent = ({
  comment,
  postId,
  commentWithReplyLock,
  setCommentWithReplyLock,
  onDelete,
}: CommentProps) => {
  const [user] = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(false);
  const [comments, setComments] = useState(comment.children);
  // commentValues represents editable values
  const [commentValues, setCommentValues] = useState<
    Values & { creator: Creator }
  >(comment);

  const onStartReplyCb = useCallback(() => {
    setCommentWithReplyLock(
      commentWithReplyLock != comment.id ? comment.id : null
    );
  }, [user, comment, commentWithReplyLock, setCommentWithReplyLock]);

  const onReplyCb = useCallback(
    async (values: Values) => {
      if (!user) {
        throw new Error("must be logged in to comment");
      }
      const newComment = await createComment(user, postId, {
        parentCommentId: comment.id,
        ...values,
      });
      setCommentWithReplyLock(null);
      comment.children = [...comment.children, newComment];
    },
    [user, comment, postId, setCommentWithReplyLock]
  );

  const onEditCb = useCallback(
    async ({ content, visibility }: Values) => {
      if (!user) {
        throw new Error("must be logged in to edit");
      }
      const commentDiff = diff(
        {
          content: comment.content,
        },
        {
          content,
          visibility,
        }
      );
      comment.creator = await editComment(
        user,
        postId,
        comment.id,
        commentDiff
      );
      comment.visibility = visibility;
      comment.content = content;

      setIsEditing(false);
      setCommentValues(comment);
    },
    [user, comment, postId, setCommentWithReplyLock]
  );

  const onDeleteCb = useCallback(async () => {
    if (!user) {
      throw new Error("must be logged in to delete");
    }
    await deleteComment(user, postId, comment.id);
    onDelete();
  }, [user, onDelete]);

  const onReplyCancel = useCallback(async () => {
    setCommentWithReplyLock(null);
  }, [setCommentWithReplyLock]);

  const onDeleteChildCb = useCallback(
    (i: number) => {
      const comment = comments[i];
      if (comment.children.length == 0) {
        setComments(
          update(comments, {
            $splice: [[i, 1]],
          })
        );
      } else {
        setComments(
          update(comments, {
            [i]: { $set: generateDeletedCommentFrom(comment) },
          })
        );
      }
    },
    [comments, setComments]
  );

  return (
    <div>
      <div class="flex">
        <div>
          <CommentVoteCounter comment={comment} />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <ProfileCardSm user={commentValues.creator} />
            <span className="text-gray-400 text-[11pt]">
              {timeToDisplayStr(comment.createdAt)}
            </span>
          </div>
          <div>{commentValues.content}</div>
          {comment.status != Status.DELETED && (
            <Fragment>
              {!isEditing ? (
                <Fragment>
                  <div>
                    <IconButton
                      buttonType="text"
                      startIcon={<ChatIcon />}
                      onClick={onStartReplyCb}
                    >
                      Reply
                    </IconButton>
                    <IconButton
                      buttonType="text"
                      startIcon={<PencilIcon />}
                      onClick={() => setIsEditing(true)}
                    >
                      Edit
                    </IconButton>
                    <IconButton
                      buttonType="text"
                      startIcon={<DocumentRemoveIcon />}
                      onClick={() => onDeleteCb()}
                    >
                      Delete
                    </IconButton>
                  </div>
                </Fragment>
              ) : (
                <CommentDialog
                  onSubmit={onEditCb}
                  initialValues={commentValues}
                  submitButtonLabel="Save"
                  onCancel={() => setIsEditing(false)}
                />
              )}
            </Fragment>
          )}
        </div>
      </div>
      {commentWithReplyLock == comment.id && (
        <CommentDialog
          onSubmit={onReplyCb}
          onCancel={onReplyCancel}
          submitButtonLabel="Reply"
        />
      )}
      {comments.length > 0 && (
        // TODO: Alternate border color between different levels of nesting
        <div class="m-6 p-2 border-l border-secondary-100">
          <Comments
            comments={comments}
            postId={postId}
            commentWithReplyLock={commentWithReplyLock}
            setCommentWithReplyLock={setCommentWithReplyLock}
            onDelete={onDeleteChildCb}
          />
        </div>
      )}
    </div>
  );
};

type CommentsProps = {
  postId: number;
  comments: Comment[]; // initialComments because comments can be deleted
  onDelete: (i: number) => void;
} & HasReplyLock;

const Comments = ({
  comments,
  postId,
  commentWithReplyLock,
  setCommentWithReplyLock,
  onDelete,
}: CommentsProps) => {
  return (
    <div>
      <div class="space-y-4">
        {comments.map((comment, i) => (
          <div key={comment.id}>
            <CommentComponent
              comment={comment}
              postId={postId}
              commentWithReplyLock={commentWithReplyLock}
              setCommentWithReplyLock={setCommentWithReplyLock}
              onDelete={() => onDelete(i)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comments;
