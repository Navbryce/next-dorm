import { h } from "preact";
import { useCallback, useLayoutEffect, useState } from "preact/compat";
import { getPosts } from "src/actions/Post";
import {
  CommunityPosInTree,
  CursorType,
  Post,
  PostCursor,
} from "src/types/types";
import InfinitePostsList from "src/components/InfinitePostsList";
import CommunitiesList from "src/components/CommunitiesList";
import { getCommunityPos } from "src/actions/Community";
import { ALL_COMMUNITY } from "src/model/community";
import StdLayout, { MainContent, Toolbar } from "src/components/StdLayout";
import { SortBy } from "src/components/inputs/SortSelect";

const AllScreen = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [communityPos, setCommunityPos] = useState<
    CommunityPosInTree | undefined
  >(undefined);
  const [cursorType, setCursorType] = useState<CursorType>(
    CursorType.MOST_RECENT
  );

  const onSortChangeCb = useCallback(
    (sortBy: SortBy) => {
      setCursorType(
        sortBy == SortBy.MOST_RECENT
          ? CursorType.MOST_RECENT
          : CursorType.MOST_POPULAR
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
        <CommunitiesList pos={communityPos} current={ALL_COMMUNITY} />
      </Toolbar>
      <MainContent>
        <InfinitePostsList
          posts={posts}
          setPosts={setPosts}
          fetchNextPage={fetchNextPageCb}
          onSortChange={onSortChangeCb}
        />
      </MainContent>
    </StdLayout>
  );
};

export default AllScreen;
