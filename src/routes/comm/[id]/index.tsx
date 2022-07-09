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
import { genLinkToCommunity, URLS } from "src/urls";
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
import { IconButton } from "src/components/inputs/Button";
import { PlusSmIcon } from "@heroicons/react/solid";
import PageBanner from "src/components/PageBanner";

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

      return getPosts(
        cursorType,
        cursor ?? { since: sort.since, communities: [communityId] }
      );
    },
    [communityId, sort]
  );

  const createPostCb = useCallback(() => {
    route(`${URLS.pages.communities}/${communityIdStr}/add-post`);
  }, [communityIdStr]);

  const subscribeCb = useCallback(async () => {
    if (!user) {
      route(URLS.pages.users.signIn);
    }
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
        {community && (
          <PageBanner>
            <Title>{community.name}</Title>
          </PageBanner>
        )}
        <div className="p-6">
          <CommunityBreadcrumb pos={communityPos} current={community} />
        </div>
        <InfinitePostsList
          beforePostsEl={
            <div
              className="flex flex-col p-6 box-border"
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
          noPostsMessage={
            "No posts. Each community and sub-community has an independent message board. Maybe someone" +
            "has something to say in one of it's child communities."
          }
        />
      </MainContent>
      <Toolbar>
        <div className="box mt-5 p-5 space-y-2 rounded flex flex-col justify-center items-center">
          <h3>{community.name}</h3>
          <SubscribeButton onClick={subscribeCb} isSubscribed={isSubscribed} />
          <IconButton
            buttonType="contained"
            startIcon={<PlusSmIcon />}
            onClick={createPostCb}
          >
            Post
          </IconButton>
        </div>
      </Toolbar>
    </StdLayout>
  );
};

export default CommunityScreen;
