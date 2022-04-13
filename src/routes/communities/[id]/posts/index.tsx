import { FunctionalComponent, h } from "preact";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "preact/compat";
import { createPost, getPost, getPosts } from "src/actions/Post";
import {
  Community,
  CommunityWithSubStatus,
  Post,
  PostCursor,
} from "src/types/types";
import PostDialog, { Values } from "src/components/inputs/PostDialog";
import InfinitePostsList from "src/components/InfinitePostsList";
import { getCommunity } from "src/actions/Community";
import SubscribeButton from "src/components/SubscribeButton";
import { subscribe } from "src/actions/Subscription";
import { route } from "preact-router";
import { URLS } from "src/urls";
import PostComponent from "src/components/Post";

const PostScreen = ({
  communityId: communityIdStr,
  postId: postIdStr,
}: {
  communityId: string;
  postId: string;
}) => {
  const postId = useMemo(() => parseInt(postIdStr), [postIdStr]);
  const [post, setPost] = useState<Post | undefined>(undefined);

  useEffect(() => {
    (async () => {
      setPost(await getPost(postId));
    })();
  }, [postId]);

  if (!post) {
    return <div />;
  }

  return (
    <div class="">
      <PostComponent post={post} />
    </div>
  );
};

export default PostScreen;
