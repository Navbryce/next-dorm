import { FunctionalComponent, h } from "preact";

import { Comment, Post, Visibility } from "../types/types";
import { PostProfileCard } from "./ProfileCard";
import { useCallback, useContext, useEffect, useState } from "preact/compat";
import { createComment, getComments } from "../actions/Comment";
import Comments from "./Comments";
import CommentDialog, { Values } from "./inputs/CommentDialog";
import { UserContext } from "src/contexts";
import { PostVoteCounter } from "src/components/VoteCounter";

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
          <PostProfileCard user={post.creator} />
          <div>{post.content}</div>
        </div>
      </div>
      <div class="mt-5 pt-5 border-t border-secondary-100">
        {comments && (
          <div>
            <CommentDialog
              content={commentDialogContent}
              setContent={setCommentDialogContent}
              onSubmit={createCommentCb}
            />
            <Comments
              comments={comments}
              postId={post.id}
              commentWithReplyLock={commentWithReplyLock}
              setCommentWithReplyLock={setCommentWithReplyLock}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PostComponent;
