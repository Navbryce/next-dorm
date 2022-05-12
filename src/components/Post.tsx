import { Fragment, FunctionalComponent, h } from "preact";

import { Comment, KnownContentAuthor, Post } from "../types/types";
import { ProfileCard } from "./ProfileCard";
import { useCallback, useContext, useEffect, useState } from "preact/compat";
import { createComment, getComments } from "../actions/Comment";
import Comments from "./Comments";
import CommentDialog, { Values } from "./inputs/CommentDialog";
import { UserContext } from "src/contexts";
import { PostVoteCounter } from "src/components/VoteCounter";
import UploadedImage from "src/components/UploadedImage";
import { timeToDisplayStr } from "src/utils/display";
import { genLinkToCommunity, genLinkToEditPost, genLinkToPost } from "src/urls";
import { IconButton } from "src/components/inputs/Button";
import { PencilIcon } from "@heroicons/react/outline";
import { canModifyPost } from "src/actions/user-parse";
import { DocumentRemoveIcon } from "@heroicons/react/solid";
import { deletePost } from "src/actions/Post";
import { route } from "preact-router";
import update from "immutability-helper";
import { generateDeletedCommentFrom } from "src/utils/comment";
import SortSelect, { SortBy } from "src/components/inputs/SortSelect";

const sortByToValueFunc = {
  [SortBy.MOST_POPULAR]: (comment: Comment) => -comment.voteTotal,
  [SortBy.MOST_RECENT]: (comment: Comment) => -comment.createdAt.unix(),
};

function sortComments(comments: Comment[], sort: SortBy): Comment[] {
  const valFunc = sortByToValueFunc[sort];
  const sortedComments = [...comments].sort(
    (c1, c2) => valFunc(c1) - valFunc(c2)
  );
  sortedComments.forEach(
    (comment) => (comment.children = sortComments(comment.children, sort))
  );
  return sortedComments;
}

const PostComponent = ({ post }: { post: Post }) => {
  const [user] = useContext(UserContext);
  const [commentsList, setCommentsList] =
    useState<{ comments: Comment[]; sortedBy?: SortBy }>();
  const [commentWithReplyLock, setCommentWithReplyLock] = useState<
    number | null
  >(null);
  const [sortBy, setSortBy] = useState(SortBy.MOST_RECENT);

  useEffect(() => {
    getComments(post.id).then((value) => setCommentsList({ comments: value }));
  }, [post]);

  useEffect(() => {
    if (!commentsList || commentsList.sortedBy == sortBy) {
      return;
    }
    setCommentsList({
      comments: sortComments(commentsList.comments, sortBy),
      sortedBy: sortBy,
    });
  }, [commentsList, setCommentsList, sortBy]);

  const createCommentCb = useCallback(
    async (values: Values) => {
      if (!commentsList) {
        return;
      }
      if (!user) {
        throw new Error("must  be logged in to comment");
      }
      const comment = await createComment(user, post.id, values);
      setCommentsList({
        sortedBy: commentsList.sortedBy,
        comments: [comment, ...commentsList.comments],
      });
    },
    [post, commentsList]
  );

  const onDeleteCb = useCallback(() => {
    if (!user) {
      throw new Error("must be logged in");
    }
    deletePost(user, post.id).then(() => {
      route("/");
    });
  }, [post, user]);

  const onDeleteChildCb = useCallback(
    (i: number) => {
      if (!commentsList) {
        return;
      }
      const comment = commentsList.comments[i];
      let newComments: Comment[];
      if (comment.children.length == 0) {
        newComments = update(commentsList.comments, {
          $splice: [[i, 1]],
        });
      } else {
        newComments = update(commentsList.comments, {
          [i]: { $set: generateDeletedCommentFrom(comment) },
        });
      }
      setCommentsList({
        comments: newComments,
        sortedBy: commentsList.sortedBy,
      });
    },
    [commentsList, setCommentsList]
  );

  return (
    <div class="h-full w-full">
      <div>
        <h1>{post.title}</h1>
      </div>
      <div class="flex">
        <div>
          <PostVoteCounter post={post} />
        </div>
        <div>
          <ProfileCard user={post.creator} />
          <div className="text-gray-400 text-[12pt]">
            <span className="text-gray-400">
              {timeToDisplayStr(post.createdAt)}
            </span>
            <a
              href={genLinkToCommunity(post.communities[0])}
              className={"hover:underline"}
            >
              <span className="italic"> @ {post.communities[0].name}</span>
            </a>
          </div>
          <div>{post.content}</div>
          <div>
            {post.imageBlobNames.map((val, i) => (
              <UploadedImage
                blobName={val}
                key={i}
                className="max-w-full max-h-[90vh]"
              />
            ))}
          </div>
          <div className="pt-2">
            {canModifyPost(user, post) && (
              <Fragment>
                <a href={genLinkToEditPost(post)}>
                  <IconButton
                    buttonType="text"
                    startIcon={<PencilIcon height={25} />}
                  >
                    Edit
                  </IconButton>
                </a>
                <IconButton
                  buttonType="text"
                  startIcon={<DocumentRemoveIcon height={25} />}
                  onClick={() => onDeleteCb()}
                >
                  Delete
                </IconButton>
              </Fragment>
            )}
          </div>
        </div>
      </div>
      <div class="my-5 py-5 border-t border-secondary-100">
        {commentsList && (
          <div>
            <CommentDialog
              onSubmit={createCommentCb}
              submitButtonLabel="Reply"
            />
            <div className="mt-5">
              <div className="mb-5">
                <SortSelect value={sortBy} onChange={setSortBy} />
              </div>
              <Comments
                comments={commentsList.comments}
                postId={post.id}
                commentWithReplyLock={commentWithReplyLock}
                setCommentWithReplyLock={setCommentWithReplyLock}
                onDelete={onDeleteChildCb}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostComponent;
