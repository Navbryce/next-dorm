import { h, VNode } from "preact";
import InfiniteScroll from "react-infinite-scroller";
import { useCallback, useEffect, useRef, useState } from "preact/compat";
import { CursorType, Post, PostCursor, StateProps } from "src/types/types";
import PostsList from "./PostsList";
import SortTypeSelect, { Sort, SortBy } from "src/components/inputs/SortSelect";

type Props<CURSOR_TYPE extends PostCursor> = {
  /*
  Fetches the next page. Returns a null cursor if no next page. Maybe simplify to just fetching next data and
  and keep state management out of this component?
  */
  // fetchNextPage fetches next page. assumes if this changes, to reset
  fetchNextPage: (
    previousCursor?: CURSOR_TYPE
  ) => Promise<{ posts: Post[]; nextCursor: CURSOR_TYPE | null }>;
  onSortChange: (sort: Sort) => void;
  // inject posts so new posts can be added outside this component
  noPostsMessage?: string;
  beforePostsEl?: VNode<any>;
} & StateProps<{ posts: Post[] | undefined }>;

function InfinitePostsList<CURSOR_TYPE>({
  fetchNextPage,
  posts,
  setPosts,
  onSortChange,
  beforePostsEl,
  ...rest
}: Props<CURSOR_TYPE>) {
  const [sort, setSort] = useState<Sort>({ sortBy: SortBy.MOST_RECENT });
  const [nextCursor, setNextCursor] = useState<CURSOR_TYPE>();
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const scrollDiv = useRef(null);

  useEffect(() => {
    setPosts(undefined);
    setHasMore(true);
    setNextCursor(undefined);
    setIsLoading(false);
  }, [fetchNextPage, sort, setPosts, setHasMore, setNextCursor]);

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
    setPosts([...(posts ?? []), ...newPosts]);
    // TODO: if returning less than limit, setHasMore to false
    if (!newNextCursor) {
      setHasMore(false);
    } else {
      setNextCursor(newNextCursor);
    }
    setIsLoading(false);
  }, [
    fetchNextPage,
    sort,
    setPosts,
    posts,
    setNextCursor,
    setHasMore,
    isLoading,
    setIsLoading,
  ]);

  const onSortChangeCb = useCallback(
    (sort: Sort) => {
      setSort(sort);
      onSortChange(sort);
    },
    [setSort]
  );

  return (
    <div class="w-full" ref={scrollDiv}>
      <SortTypeSelect value={sort} onChange={onSortChangeCb} />
      {beforePostsEl}
      <InfiniteScroll
        useWindow={false}
        getScrollParent={() => scrollDiv.current}
        pageStart={0}
        loadMore={fetchDataCb}
        hasMore={hasMore}
      >
        {posts ? <PostsList posts={posts} {...rest} /> : <div />}
      </InfiniteScroll>
    </div>
  );
}

export default InfinitePostsList;
