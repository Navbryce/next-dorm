import { FunctionalComponent, h } from "preact";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "preact/compat";
import { createPost, getPosts } from "../../actions/Post";
import { Community, Post, PostCursor } from "../../types/types";
import PostDialog, { Values } from "../../components/inputs/PostDialog";
import InfinitePostsList from "../../components/InfinitePostsList";
import { getCommunity } from "../../actions/Community";

const CommunityScreen = ({
  communityId: communityIdStr,
}: {
  communityId: string;
}) => {
  const [community, setCommunity] = useState<Community | undefined>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [creatingPost, setCreatingPost] = useState(false);

  const communityId = useMemo(() => parseInt(communityIdStr), [communityIdStr]);

  useLayoutEffect(() => {
    getCommunity(communityId).then(setCommunity);
  }, [communityId]);

  const fetchNextPageCb = useCallback(
    async (cursor?: PostCursor) => {
      return getPosts(cursor ?? { communities: [communityId] });
    },
    [communityId]
  );

  const createPostCb = useCallback(
    async (values: Values) => {
      try {
        const newPost = await createPost({
          ...values,
          communities: [communityId],
        });
        setPosts([newPost, ...(posts ?? [])]);
      } finally {
        setCreatingPost(false);
      }
    },
    [setPosts, setCreatingPost, posts, communityId]
  );

  return (
    <div class="relative h-full">
      {creatingPost && (
        <div class="absolute h-full w-full z-10 backdrop-blur">
          <div class="bg-slate-700">
            <PostDialog onSubmit={createPostCb} />
          </div>
        </div>
      )}
      {community && <div>{community.name}</div>}
      <button onClick={() => setCreatingPost(true)}>Add Post</button>
      <div className="h-full">
        <InfinitePostsList
          posts={posts}
          setPosts={setPosts}
          fetchNextPage={fetchNextPageCb}
        />
      </div>
    </div>
  );
};

export default CommunityScreen;
