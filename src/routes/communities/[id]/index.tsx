import { h } from "preact";
import { useCallback, useLayoutEffect, useMemo, useState } from "preact/compat";
import { getPosts } from "src/actions/Post";
import {
  CommunityPosInTree,
  CommunityWithSubStatus,
  CursorType,
  Post,
  PostCursor,
} from "src/types/types";
import InfinitePostsList from "src/components/InfinitePostsList";
import { getCommunity, getCommunityPos } from "src/actions/Community";
import SubscribeButton from "src/components/SubscribeButton";
import { subscribe } from "src/actions/Subscription";
import { route } from "preact-router";
import { URLS } from "src/urls";
import CommunitiesList from "src/components/CommunitiesList";
import CommunityBreadcrumb from "src/components/CommunityBreadcrumb";
import StdLayout, { MainContent, Toolbar } from "src/components/StdLayout";
import { SortBy } from "src/components/inputs/SortSelect";

const CommunityScreen = ({
  communityId: communityIdStr,
}: {
  communityId: string;
}) => {
  const [community, setCommunity] = useState<
    CommunityWithSubStatus | undefined
  >();
  const [communityPos, setCommunityPos] = useState<
    CommunityPosInTree | undefined
  >(undefined);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [cursorType, setCursorType] = useState<CursorType>(
    CursorType.SUBBED_MOST_RECENT
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
      return getPosts(cursorType, cursor ?? { communities: [communityId] });
    },
    [communityId, cursorType]
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
        <div class="flex w-full h-full">
          <div class="w-4/5">
            {community && (
              <div>
                <h2>{community.name}</h2>
              </div>
            )}
            <div className="h-full">
              <div>
                <CommunityBreadcrumb pos={communityPos} current={community} />
              </div>
              <InfinitePostsList
                posts={posts}
                setPosts={setPosts}
                fetchNextPage={fetchNextPageCb}
                onSortChange={onSortChangeCb}
              />
            </div>
          </div>
        </div>
      </MainContent>
      <Toolbar>
        <div className="h-1/4 m-5 p-5 space-x-5 rounded outline flex justify-around items-center">
          <div className="h-fit">
            <button
              type="button"
              onClick={createPostCb}
              className="btn inline-block"
            >
              Add Post
            </button>
          </div>
          <div className="h-fit">
            <SubscribeButton
              onClick={subscribeCb}
              isSubscribed={isSubscribed}
            />
          </div>
        </div>
      </Toolbar>
    </StdLayout>
  );
};

export default CommunityScreen;
