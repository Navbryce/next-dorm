import { FunctionalComponent, h } from "preact";
import { useCallback, useState } from "preact/compat";
import { getPosts, PostCursor } from "../actions/Post";
import { Post } from "../model/types";
import InfinitePostsList from "../components/InfinitePostsList";

const AllScreen = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  const fetchNextPageCb = useCallback(async (cursor?: PostCursor) => {
    return getPosts(cursor);
  }, []);

  return (
    <div class="relative h-full">
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
