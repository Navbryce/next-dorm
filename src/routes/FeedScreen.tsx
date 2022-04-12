import { FunctionalComponent, h } from "preact";
import { useCallback, useState } from "preact/compat";
import { Post, PostCursor } from "../types/types";
import InfinitePostsList from "../components/InfinitePostsList";
import { getFeed } from "../actions/Feed";

const FeedScreen = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  const fetchNextPageCb = useCallback(async (cursor?: PostCursor) => {
    return getFeed(cursor);
  }, []);

  return (
    <div class="w-full h-full">
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
