import { h } from "preact";
import { useCallback, useState } from "preact/compat";
import { getPosts } from "src/actions/Post";
import { Post, PostCursor } from "src/types/types";
import InfinitePostsList from "src/components/InfinitePostsList";

const AllScreen = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  const fetchNextPageCb = useCallback(async (cursor?: PostCursor) => {
    return getPosts(cursor);
  }, []);

  return (
    <div class="w-full h-full">
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
