import { FunctionalComponent, h } from "preact";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "preact/compat";
import { createPost, getPosts } from "src/actions/Post";
import {
  Community,
  CommunityPosInTree,
  CommunityWithSubStatus,
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
import Breadcrumb, { BreadcrumbItem } from "src/components/Breadcrumb";
import CommunityBreadcrumb from "src/components/CommunityBreadcrumb";

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
      return getPosts(cursor ?? { communities: [communityId] });
    },
    [communityId]
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
    <div class="relative w-full h-full flex">
      <div className="w-64">
        <CommunitiesList current={community} pos={communityPos} />
      </div>
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
            />
          </div>
        </div>
        <div class="h-1/4 m-5 p-5 space-x-5 rounded outline flex justify-around items-center">
          <div class="h-fit">
            <button
              type="button"
              onClick={createPostCb}
              className="btn inline-block"
            >
              Add Post
            </button>
          </div>
          <div class="h-fit">
            <SubscribeButton
              onClick={subscribeCb}
              isSubscribed={isSubscribed}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityScreen;
