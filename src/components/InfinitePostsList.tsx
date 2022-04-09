import { FunctionalComponent, h } from "preact";
import InfiniteScroll from "react-infinite-scroller";
import { useCallback, useEffect, useRef, useState } from "preact/compat";
import { getPosts, PostCursor } from "../actions/Post";
import { Post, StateProps } from "../types/types";
import PostsList from "./PostsList";

type Props<CURSOR_TYPE extends PostCursor> = {
  /*
  Fetches the next page. Returns a null cursor if no next page. Maybe simplify to just fetching next data and
  and keep state management out of this component?
  */
  // fetchNextPage fetches next page. assumes if this changes, to reset
  fetchNextPage: (
    previousCursor?: CURSOR_TYPE
  ) => Promise<{ posts: Post[]; nextCursor: CURSOR_TYPE | null }>;
  // inject posts so new posts can be added outside this component
} & StateProps<{ posts: Post[] }>;

function InfinitePostsList<CURSOR_TYPE>({
  fetchNextPage,
  posts,
  setPosts,
}: Props<CURSOR_TYPE>) {
  const [nextCursor, setNextCursor] = useState<CURSOR_TYPE>();
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const scrollDiv = useRef(null);

  useEffect(() => {
    setPosts([]);
    setHasMore(true);
    setNextCursor(undefined);
    setIsLoading(false);
  }, [fetchNextPage, setPosts, setHasMore, setNextCursor]);

  const fetchDataCb = useCallback(async () => {
    if (isLoading) {
      // avoid overlapping api calls. see react-infinite-scroll documentation
      return;
    }
    setIsLoading(true);
    const { posts: newPosts, nextCursor: newNextCursor } = await fetchNextPage(
      nextCursor
    );
    setPosts([...posts, ...newPosts]);
    // TODO: if returning less than limit, setHasMore to false
    if (!newNextCursor) {
      setHasMore(false);
    } else {
      setNextCursor(newNextCursor);
    }
    setIsLoading(false);
  }, [
    fetchNextPage,
    setPosts,
    posts,
    setNextCursor,
    setHasMore,
    isLoading,
    setIsLoading,
  ]);

  return (
    <div class="h-full overflow-auto" ref={scrollDiv}>
      <InfiniteScroll
        useWindow={false}
        getScrollParent={() => scrollDiv.current}
        pageStart={0}
        loadMore={fetchDataCb}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
      >
        <PostsList posts={posts} />
      </InfiniteScroll>
    </div>
  );
}

export default InfinitePostsList;
