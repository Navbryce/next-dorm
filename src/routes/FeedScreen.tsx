import {
  useCallback,
  useContext,
  useLayoutEffect,
  useState,
} from "preact/compat";
import {
  CommunityPosInTree,
  CursorType,
  Post,
  PostCursor,
} from "../types/types";
import InfinitePostsList from "../components/InfinitePostsList";
import CommunitiesList from "src/components/CommunitiesList";
import { getCommunityPos } from "src/actions/Community";
import StdLayout, {
  MainContent,
  Title,
  Toolbar,
} from "src/components/StdLayout";
import { getPosts } from "src/actions/Post";
import { Sort, SortBy } from "src/components/inputs/SortSelect";
import { URLS } from "src/urls";
import { ReferringScreenContext } from "src/contexts";

const FeedScreen = () => {
  const [, setReferringScreenURL] = useContext(ReferringScreenContext);

  const [posts, setPosts] = useState<Post[]>();
  const [communityPos, setCommunityPos] = useState<
    CommunityPosInTree | undefined
  >(undefined);
  const [sort, setSort] = useState<Sort>({ sortBy: SortBy.MOST_RECENT });
  const fetchNextPageCb = useCallback(
    async (cursor?: PostCursor) => {
      const cursorType =
        sort.sortBy == SortBy.MOST_RECENT
          ? CursorType.SUBBED_MOST_RECENT
          : CursorType.SUBBED_MOST_POPULAR;

      return getPosts(
        cursorType,
        cursor ?? {
          since: sort.since,
        }
      );
    },
    [sort]
  );

  useLayoutEffect(() => {
    setReferringScreenURL(URLS.pages.feed);
    getCommunityPos(undefined).then(setCommunityPos);
  }, [setCommunityPos, setReferringScreenURL]);

  return (
    <StdLayout>
      <Toolbar>
        <CommunitiesList current={undefined} pos={communityPos} />
      </Toolbar>
      <MainContent>
        <div className="p-6">
          <Title>Your feed</Title>
        </div>
        <InfinitePostsList
          posts={posts}
          setPosts={setPosts}
          fetchNextPage={fetchNextPageCb}
          onSortChange={setSort}
          noPostsMessage="No posts. Are you subscribed to anything?"
        />
      </MainContent>
      <Toolbar />
    </StdLayout>
  );
};

export default FeedScreen;
