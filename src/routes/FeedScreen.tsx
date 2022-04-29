import { FunctionalComponent, h } from "preact";
import { useCallback, useLayoutEffect, useState } from "preact/compat";
import { CommunityPosInTree, Post, PostCursor } from "../types/types";
import InfinitePostsList from "../components/InfinitePostsList";
import { getFeed } from "../actions/Feed";
import CommunitiesList from "src/components/CommunitiesList";
import { getCommunityPos } from "src/actions/Community";

const FeedScreen = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [communityPos, setCommunityPos] = useState<
    CommunityPosInTree | undefined
  >(undefined);

  const fetchNextPageCb = useCallback(async (cursor?: PostCursor) => {
    return getFeed(cursor);
  }, []);

  useLayoutEffect(() => {
    getCommunityPos(undefined).then(setCommunityPos);
  }, []);

  return (
    <div class="w-full h-full flex">
      {/*TODO: Create layout element*/}
      <div className="w-64">
        <CommunitiesList current={undefined} pos={communityPos} />
      </div>
      <div class="h-full">
        {posts.length == 0 && <div />}
        <InfinitePostsList
          posts={posts}
          setPosts={setPosts}
          fetchNextPage={fetchNextPageCb}
        />
      </div>
    </div>
  );
};

export default FeedScreen;
