import { useCallback, useLayoutEffect, useState } from "preact/compat";
import {
  CommunityPosInTree,
  CursorType,
  Post,
  PostCursor,
} from "../types/types";
import InfinitePostsList from "../components/InfinitePostsList";
import CommunitiesList from "src/components/CommunitiesList";
import { getCommunityPos } from "src/actions/Community";
import StdLayout, { MainContent, Toolbar } from "src/components/StdLayout";
import { getPosts } from "src/actions/Post";
import { SortBy } from "src/components/inputs/SortSelect";

const FeedScreen = () => {
  const [posts, setPosts] = useState<Post[]>();
  const [communityPos, setCommunityPos] = useState<
    CommunityPosInTree | undefined
  >(undefined);
  const [cursorType, setCursorType] = useState<CursorType>(
    CursorType.SUBBED_MOST_RECENT
  );

  const onSortChangeCb = useCallback(
    (sortBy: SortBy) => {
      setCursorType(
        sortBy == SortBy.MOST_RECENT
          ? CursorType.SUBBED_MOST_RECENT
          : CursorType.SUBBED_MOST_POPULAR
      );
    },
    [setCursorType]
  );

  const fetchNextPageCb = useCallback(
    async (cursor?: PostCursor) => {
      return getPosts(cursorType, cursor);
    },
    [cursorType]
  );

  useLayoutEffect(() => {
    getCommunityPos(undefined).then(setCommunityPos);
  }, []);

  return (
    <StdLayout>
      <Toolbar>
        <CommunitiesList current={undefined} pos={communityPos} />
      </Toolbar>
      <MainContent>
        <h2>Your feed</h2>
        <InfinitePostsList
          posts={posts}
          setPosts={setPosts}
          fetchNextPage={fetchNextPageCb}
          onSortChange={onSortChangeCb}
          noPostsMessage="No posts. Are you subscribed to anything?"
        />
      </MainContent>
    </StdLayout>
  );
};

export default FeedScreen;
