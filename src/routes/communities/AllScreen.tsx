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
import StdLayout, {
  MainContent,
  Title,
  Toolbar,
} from "src/components/StdLayout";
import { Sort, SortBy } from "src/components/inputs/SortSelect";
import CommunityBreadcrumb from "src/components/CommunityBreadcrumb";

const AllScreen = () => {
  const [posts, setPosts] = useState<Post[]>();
  const [communityPos, setCommunityPos] = useState<
    CommunityPosInTree | undefined
  >(undefined);
  const [sort, setSort] = useState<Sort>({ sortBy: SortBy.MOST_RECENT });

  const fetchNextPageCb = useCallback(
    async (cursor?: PostCursor) => {
      const cursorType =
        sort.sortBy == SortBy.MOST_RECENT
          ? CursorType.MOST_RECENT
          : CursorType.MOST_POPULAR;

      return getPosts(cursorType, cursor ?? { since: sort.since });
    },
    [sort]
  );

  useLayoutEffect(() => {
    getCommunityPos(undefined).then(setCommunityPos);
  }, []);

  return (
    <StdLayout>
      <Toolbar>
        <CommunitiesList pos={communityPos} />
      </Toolbar>
      <MainContent>
        <Title>All Communities</Title>
        <CommunityBreadcrumb />
        <InfinitePostsList
          posts={posts}
          setPosts={setPosts}
          fetchNextPage={fetchNextPageCb}
          onSortChange={setSort}
        />
      </MainContent>
      <Toolbar />
    </StdLayout>
  );
};

export default AllScreen;
