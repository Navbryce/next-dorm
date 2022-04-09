import { FunctionalComponent, h } from "preact";

import { Comment, Post, Visibility } from "../types/types";
import { PostProfileCard } from "./ProfileCard";
import { useCallback, useEffect, useState } from "preact/compat";
import { createComment, getComments } from "../actions/Comment";
import Comments from "./Comments";
import CommentDialog, { Values } from "./inputs/CommentDialog";

const PostComponent = ({ post }: { post: Post }) => {
  const [comments, setComments] = useState<Comment[]>();

  useEffect(() => {
    setComments([]);
    getComments(post.id).then(setComments);
  }, [post]);

  const createCommentCb = useCallback(
    async (values: Values) => {
      if (!comments) {
        return;
      }
      const comment = await createComment(post.id, values);
      setComments([comment, ...comments]);
    },
    [post, comments]
  );

  return (
    <div class="bg-primary-600 h-full overflow-y-scroll">
      <div>
        <h2>{post.title}</h2>
      </div>
      <PostProfileCard user={post.creator} />
      <div>{post.content}</div>
      <div class="mt-5 pt-5 border-t border-secondary-100">
        {comments && (
          <div>
            <CommentDialog onSubmit={createCommentCb} />
            <Comments comments={comments} postId={post.id} />
          </div>
        )}
      </div>
    </div>
  );
};

export default PostComponent;
