import { Fragment } from "preact";
import {
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
} from "preact/compat";
import { getPosts } from "src/actions/Post";
import {
  CommunityPosInTree,
  CommunityWithSubStatus,
  CursorType,
  Post,
  PostCursor,
  Visibility,
} from "src/types/types";
import InfinitePostsList from "src/components/InfinitePostsList";
import { getCommunity, getCommunityPos } from "src/actions/Community";
import SubscribeButton from "src/components/SubscribeButton";
import { subscribe } from "src/actions/Subscription";
import { route } from "preact-router";
import { URLS } from "src/urls";
import CommunitiesList from "src/components/CommunitiesList";
import CommunityBreadcrumb from "src/components/CommunityBreadcrumb";
import StdLayout, {
  MainContent,
  Title,
  Toolbar,
} from "src/components/StdLayout";
import { Sort, SortBy } from "src/components/inputs/SortSelect";
import { UserContext } from "src/contexts";
import VisibilitySelect from "src/components/inputs/VisibilitySelect";

const CommunityScreen = ({
  communityId: communityIdStr,
}: {
  communityId: string;
}) => {
  const [user] = useContext(UserContext);
  const [community, setCommunity] = useState<
    CommunityWithSubStatus | undefined
  >();
  const [communityPos, setCommunityPos] = useState<
    CommunityPosInTree | undefined
  >(undefined);
  const [posts, setPosts] = useState<Post[]>();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [sort, setSort] = useState<Sort>({ sortBy: SortBy.MOST_RECENT });

  const communityId = useMemo(() => parseInt(communityIdStr), [communityIdStr]);

  useLayoutEffect(() => {
    getCommunity(communityId).then((community) => {
      setCommunity(community);
      setIsSubscribed(community.isSubscribed);
    });
    getCommunityPos(communityId).then(setCommunityPos);
  }, [communityId]);

  const fetchNextPageCb = useCallback(
    async (cursor?: PostCursor) => {
      const cursorType =
        sort.sortBy == SortBy.MOST_RECENT
          ? CursorType.MOST_RECENT
          : CursorType.MOST_POPULAR;

      return getPosts(cursorType, cursor ?? { since: sort.since });
    },
    [communityId, sort]
  );

  const createPostCb = useCallback(() => {
    route(`${URLS.pages.communities}/${communityIdStr}/add-post`);
  }, [communityIdStr]);

  const subscribeCb = useCallback(async () => {
    await subscribe({
      [communityId]: !isSubscribed,
    });
    setIsSubscribed(!isSubscribed);
  }, [communityId, isSubscribed]);

  if (!community) {
    return <div />;
  }

  return (
    <StdLayout>
      <Toolbar>
        <CommunitiesList current={community} pos={communityPos} />
      </Toolbar>
      <MainContent>
        {community && <Title>{community.name}</Title>}
        <CommunityBreadcrumb pos={communityPos} current={community} />
        <InfinitePostsList
          beforePostsEl={
            <div
              className="flex flex-col p-8 m-4 border-b border-secondary-100"
              onClick={createPostCb}
            >
              <textarea className="resize-none">What's got you upset?</textarea>
              <div className="flex justify-end items-center mt-4">
                <VisibilitySelect
                  value={Visibility.NORMAL}
                  onChange={
                    // eslint-disable-next-line @typescript-eslint/no-empty-function
                    () => {}
                  }
                />
                <button className="btn ml-4">Post!</button>
              </div>
            </div>
          }
          posts={posts}
          setPosts={setPosts}
          fetchNextPage={fetchNextPageCb}
          onSortChange={setSort}
        />
      </MainContent>
      <Toolbar>
        <div className="h-1/4 m-5 p-5 space-y-2 rounded outline flex flex-col justify-center items-center">
          <h3>{community.name}</h3>
          {user && (
            <Fragment>
              <SubscribeButton
                onClick={subscribeCb}
                isSubscribed={isSubscribed}
              />
            </Fragment>
          )}
        </div>
      </Toolbar>
    </StdLayout>
  );
};

export default CommunityScreen;
