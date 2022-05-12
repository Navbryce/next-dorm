import { h } from "preact";
import InfiniteScroll from "react-infinite-scroller";
import { useCallback, useEffect, useRef, useState } from "preact/compat";
import { CursorType, Post, PostCursor, StateProps } from "src/types/types";
import PostsList from "./PostsList";
import SortSelect, { SortBy } from "src/components/inputs/SortSelect";

type Props<CURSOR_TYPE extends PostCursor> = {
  /*
  Fetches the next page. Returns a null cursor if no next page. Maybe simplify to just fetching next data and
  and keep state management out of this component?
  */
  // fetchNextPage fetches next page. assumes if this changes, to reset
  fetchNextPage: (
    previousCursor?: CURSOR_TYPE
  ) => Promise<{ posts: Post[]; nextCursor: CURSOR_TYPE | null }>;
  onSortChange: (sort: SortBy) => void;
  // inject posts so new posts can be added outside this component
} & StateProps<{ posts: Post[] }>;

function InfinitePostsList<CURSOR_TYPE>({
  fetchNextPage,
  posts,
  setPosts,
  onSortChange,
}: Props<CURSOR_TYPE>) {
  const [sortBy, setSortBy] = useState<SortBy>(SortBy.MOST_RECENT);
  const [nextCursor, setNextCursor] = useState<CURSOR_TYPE>();
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const scrollDiv = useRef(null);

  useEffect(() => {
    setPosts([]);
    setHasMore(true);
    setNextCursor(undefined);
    setIsLoading(false);
  }, [fetchNextPage, sortBy, setPosts, setHasMore, setNextCursor]);

  const fetchDataCb = useCallback(async () => {
    if (isLoading) {
      // avoid overlapping api calls. see react-infinite-scroll documentation
      return;
    }
    setIsLoading(true);

    let newPosts: Post[] = [];
    let newNextCursor: CURSOR_TYPE | null;
    try {
      ({ posts: newPosts, nextCursor: newNextCursor } = await fetchNextPage(
        nextCursor
      ));
    } catch (e) {
      setHasMore(false);
      setIsLoading(false);
      return;
    }
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
    sortBy,
    setPosts,
    posts,
    setNextCursor,
    setHasMore,
    isLoading,
    setIsLoading,
  ]);

  const onSortChangeCb = useCallback(
    (sort: SortBy) => {
      setSortBy(sort);
      onSortChange(sort);
    },
    [setSortBy]
  );

  return (
    <div class="w-full h-full" ref={scrollDiv}>
      <SortSelect value={sortBy} onChange={onSortChangeCb} />
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
