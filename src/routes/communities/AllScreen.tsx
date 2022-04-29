import { h } from "preact";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "preact/compat";
import { getPosts } from "src/actions/Post";
import { CommunityPosInTree, Post, PostCursor } from "src/types/types";
import InfinitePostsList from "src/components/InfinitePostsList";
import CommunitiesList from "src/components/CommunitiesList";
import { getCommunity, getCommunityPos } from "src/actions/Community";
import { ALL_COMMUNITY } from "src/model/community";

const AllScreen = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [communityPos, setCommunityPos] = useState<
    CommunityPosInTree | undefined
  >(undefined);

  const fetchNextPageCb = useCallback(async (cursor?: PostCursor) => {
    return getPosts(cursor);
  }, []);

  useLayoutEffect(() => {
    getCommunityPos(undefined).then(setCommunityPos);
  }, []);

  return (
    <div class="w-full h-full flex">
      <div className="w-64">
        <CommunitiesList pos={communityPos} current={ALL_COMMUNITY} />
      </div>
      <div class="h-full">
        <InfinitePostsList
          posts={posts}
          setPosts={setPosts}
          fetchNextPage={fetchNextPageCb}
        />
      </div>
    </div>
  );
};

export default AllScreen;
