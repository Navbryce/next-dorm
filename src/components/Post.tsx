import { Fragment, FunctionalComponent, h } from "preact";

import { Comment, KnownDisplayableUser, Post } from "../types/types";
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
import { canModifyPost } from "src/utils/user";
import { DocumentRemoveIcon } from "@heroicons/react/solid";
import { deletePost } from "src/actions/Post";
import { route } from "preact-router";

const PostComponent = ({ post }: { post: Post }) => {
  const [user] = useContext(UserContext);
  const [comments, setComments] = useState<Comment[]>();
  const [commentDialogContent, setCommentDialogContent] = useState("");
  const [commentWithReplyLock, setCommentWithReplyLock] = useState<
    number | null
  >(null);

  useEffect(() => {
    setComments([]);
    getComments(post.id).then(setComments);
  }, [post]);

  const createCommentCb = useCallback(
    async (values: Values) => {
      if (!comments) {
        return;
      }
      if (!user) {
        throw new Error("must  be logged in to comment");
      }
      const comment = await createComment(user, post.id, values);
      setComments([comment, ...comments]);
      setCommentDialogContent("");
    },
    [post, comments, setCommentDialogContent]
  );

  const onDeleteCb = useCallback(() => {
    if (!user) {
      throw new Error("must be logged in");
    }
    deletePost(user, post.id).then(() => {
      route("/");
    });
  }, [post, user]);

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
        {comments && (
          <div>
            <CommentDialog
              content={commentDialogContent}
              setContent={setCommentDialogContent}
              onSubmit={createCommentCb}
            />
            <div className="mt-5">
              <Comments
                comments={comments}
                postId={post.id}
                commentWithReplyLock={commentWithReplyLock}
                setCommentWithReplyLock={setCommentWithReplyLock}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostComponent;
