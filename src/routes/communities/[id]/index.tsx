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
  CommunityWithSubStatus,
  Post,
  PostCursor,
} from "src/types/types";
import PostDialog, { Values } from "src/components/inputs/PostDialog";
import InfinitePostsList from "src/components/InfinitePostsList";
import { getCommunity } from "src/actions/Community";
import SubscribeButton from "src/components/SubscribeButton";
import { subscribe } from "src/actions/Subscription";
import { route } from "preact-router";
import { URLS } from "src/urls";

const CommunityScreen = ({
  communityId: communityIdStr,
}: {
  communityId: string;
}) => {
  const [community, setCommunity] = useState<
    CommunityWithSubStatus | undefined
  >();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const communityId = useMemo(() => parseInt(communityIdStr), [communityIdStr]);

  useLayoutEffect(() => {
    (async () => {
      const community = await getCommunity(communityId);
      setCommunity(community);
      setIsSubscribed(community.isSubscribed);
    })();
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
    <div class="relative w-full h-full">
      <div class="flex w-full h-full">
        <div class="w-4/5">
          {community && (
            <div>
              <h2>{community.name}</h2>
            </div>
          )}
          <div className="h-full">
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
              className="inline-block"
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
