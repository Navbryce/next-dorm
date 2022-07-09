import { Fragment } from "preact";

import { Comment, StateProps, Status } from "../types/types";
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
import { canModifyComment } from "src/actions/user-parse";

type HasReplyLock = StateProps<{ commentWithReplyLock: number | null }>;

type CommentProps = {
  comment: Comment;
  postId: number;
  onDelete: () => void;
  onEdit: (newComment: Comment) => void;
} & HasReplyLock;

const ACTION_ICON_SIZE = { width: 15, height: 15 };

const CommentComponent = ({
  comment,
  postId,
  commentWithReplyLock,
  setCommentWithReplyLock,
  onDelete,
  onEdit,
}: CommentProps) => {
  const [user] = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(false);
  const [comments, setComments] = useState(comment.children);
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
      setComments(comment.children);
    },
    [user, comment, postId, setCommentWithReplyLock, setComments]
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
      onEdit(comment);
      setIsEditing(false);
    },
    [user, comment, postId, setCommentWithReplyLock]
  );

  const onDeleteCb = useCallback(async () => {
    if (!user) {
      throw new Error("must be logged in to delete");
    }
    await deleteComment(postId, comment.id);
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

  const onEditChildCb = useCallback(
    (i: number, newComment: Comment) => {
      const comment = comments[i];
      setComments(
        update(comments, {
          [i]: { $set: newComment },
        })
      );
    },
    [comments, setComments]
  );

  return (
    <div>
      <div className="flex">
        <div>
          <CommentVoteCounter postId={postId} comment={comment} />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <ProfileCardSm user={comment.creator} />
            <span className="text-gray-400 text-[11pt]">
              {timeToDisplayStr(comment.createdAt)}
            </span>
          </div>
          <div>{comment.content}</div>
          {comment.status != Status.DELETED && (
            <Fragment>
              {!isEditing ? (
                <Fragment>
                  <div>
                    {user?.profile && (
                      <IconButton
                        buttonType="text"
                        startIcon={<ChatIcon {...ACTION_ICON_SIZE} />}
                        onClick={onStartReplyCb}
                        className="text-xs"
                      >
                        Reply
                      </IconButton>
                    )}
                    {canModifyComment(user, comment) && (
                      <Fragment>
                        <IconButton
                          buttonType="text"
                          startIcon={<PencilIcon {...ACTION_ICON_SIZE} />}
                          onClick={() => setIsEditing(true)}
                          className="text-xs"
                        >
                          Edit
                        </IconButton>
                        <IconButton
                          buttonType="text"
                          startIcon={
                            <DocumentRemoveIcon {...ACTION_ICON_SIZE} />
                          }
                          onClick={() => onDeleteCb()}
                          className="text-xs"
                        >
                          Delete
                        </IconButton>
                      </Fragment>
                    )}
                  </div>
                </Fragment>
              ) : (
                <CommentDialog
                  onSubmit={onEditCb}
                  initialValues={comment}
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
        <div className="mx-6 my-1 border-l border-secondary-100 pl-2">
          <CommentList
            comments={comments}
            postId={postId}
            commentWithReplyLock={commentWithReplyLock}
            setCommentWithReplyLock={setCommentWithReplyLock}
            onDelete={onDeleteChildCb}
            onEdit={onEditChildCb}
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
  onEdit: (i: number, newComment: Comment) => void;
  isRoot?: boolean;
} & HasReplyLock;

const CommentList = ({
  comments,
  postId,
  commentWithReplyLock,
  setCommentWithReplyLock,
  onDelete,
  onEdit,
  isRoot,
}: CommentsProps) => {
  return (
    <div>
      <div>
        {comments.map((comment, i) => (
          <div key={comment.id}>
            <CommentComponent
              comment={comment}
              postId={postId}
              commentWithReplyLock={commentWithReplyLock}
              setCommentWithReplyLock={setCommentWithReplyLock}
              onDelete={() => onDelete(i)}
              onEdit={(newComment) => onEdit(i, newComment)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentList;
