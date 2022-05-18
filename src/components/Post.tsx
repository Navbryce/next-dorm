import { Fragment } from "preact";

import { Comment, Post, Since } from "../types/types";
import { ProfileCard } from "./ProfileCard";
import { useCallback, useContext, useEffect, useState } from "preact/compat";
import { createComment, getComments } from "../actions/Comment";
import Comments from "./Comments";
import CommentDialog, { Values } from "./inputs/CommentDialog";
import { UserContext } from "src/contexts";
import { PostVoteCounter } from "src/components/VoteCounter";
import { timeToDisplayStr } from "src/utils/display";
import { genLinkToCommunity, genLinkToEditPost } from "src/urls";
import { IconButton } from "src/components/inputs/Button";
import { PencilIcon } from "@heroicons/react/outline";
import { canModifyPost } from "src/actions/user-parse";
import { DocumentRemoveIcon } from "@heroicons/react/solid";
import { deletePost } from "src/actions/Post";
import { route } from "preact-router";
import update from "immutability-helper";
import { generateDeletedCommentFrom } from "src/utils/comment";
import SortTypeSelect, { Sort, SortBy } from "src/components/inputs/SortSelect";
import dayjs, { Dayjs } from "dayjs";
import UploadedImageSlider from "src/components/Slider";

const sortByToValueFunc = {
  [SortBy.MOST_POPULAR]: (comment: Comment) => -comment.voteTotal,
  [SortBy.MOST_RECENT]: (comment: Comment) => -comment.createdAt.unix(),
};

function sinceToDate(since: Since): Dayjs {
  switch (since) {
    case Since.TODAY:
      return dayjs().subtract(1, "day");
    default:
      throw new Error(`unknown since value ${since}`);
  }
}

function sortComments(comments: Comment[], { sortBy, since }: Sort): Comment[] {
  const valFunc = sortByToValueFunc[sortBy];
  if (sortBy == SortBy.MOST_POPULAR && since) {
    const sinceDate = sinceToDate(since);
    comments = comments.filter((comment) =>
      comment.createdAt.isAfter(sinceDate)
    );
  }
  const sortedComments = [...comments].sort(
    (c1, c2) => valFunc(c1) - valFunc(c2)
  );
  sortedComments.forEach(
    (comment) =>
      (comment.children = sortComments(comment.children, { sortBy, since }))
  );
  return sortedComments;
}

const PostComponent = ({ post }: { post: Post }) => {
  const [user] = useContext(UserContext);
  const [commentsList, setCommentsList] =
    // enables us to easily show a new comment made by the user at the top  of the list
    // despite the sort
    useState<{
      original: Comment[]; // preserve comments that are filtered out (e.g., with since)
      comments: Comment[];
      sortedUsing?: Sort;
    }>();
  const [commentWithReplyLock, setCommentWithReplyLock] = useState<
    number | null
  >(null);
  const [sort, setSort] = useState({ sortBy: SortBy.MOST_RECENT });

  useEffect(() => {
    getComments(post.id).then((value) =>
      setCommentsList({ original: value, comments: value })
    );
  }, [post]);

  useEffect(() => {
    // don't re-sort if already sorted (prevent new comments from being removed)
    if (!commentsList || commentsList.sortedUsing == sort) {
      return;
    }
    setCommentsList({
      original: commentsList.original,
      comments: sortComments(commentsList.original, sort),
      sortedUsing: sort,
    });
  }, [commentsList, setCommentsList, sort]);

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
        original: [comment, ...commentsList.original],
        sortedUsing: commentsList.sortedUsing,
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

  const replaceCommentInListCb = useCallback(
    (indexInSorted: number, newComment: Comment) => {
      if (!commentsList) {
        return;
      }
      const newSortedComments = update(commentsList.comments, {
        [indexInSorted]: { $set: newComment },
      });

      const originalComment = commentsList.comments[indexInSorted];
      const indexInOriginal = commentsList.original.findIndex(
        (val) => val.id === originalComment.id
      );
      const newOriginalComments = update(commentsList.original, {
        [indexInOriginal]: { $set: newComment },
      });

      setCommentsList({
        sortedUsing: commentsList.sortedUsing,
        comments: newSortedComments,
        original: newOriginalComments,
      });
    },
    [commentsList, setCommentsList]
  );

  const onDeleteChildCb = useCallback(
    (indexInSorted: number) => {
      if (!commentsList) {
        return;
      }
      replaceCommentInListCb(
        indexInSorted,
        generateDeletedCommentFrom(commentsList.comments[indexInSorted])
      );
    },
    [commentsList, replaceCommentInListCb]
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
        {/*overflow-hidden to fix image slider bug*/}
        <div className="overflow-hidden">
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
          {post.imageBlobNames.length > 0 && (
            <UploadedImageSlider
              imageClassName="max-w-[90%] max-h-[400px]"
              blobNames={post.imageBlobNames}
            />
          )}
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
              className="z-20 relative"
            />
            <div className="mt-5 z-0 relative">
              <div className="mb-5">
                <SortTypeSelect value={sort} onChange={setSort} />
              </div>
              <Comments
                comments={commentsList.comments}
                postId={post.id}
                commentWithReplyLock={commentWithReplyLock}
                setCommentWithReplyLock={setCommentWithReplyLock}
                onDelete={onDeleteChildCb}
                onEdit={replaceCommentInListCb}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default PostComponent;
