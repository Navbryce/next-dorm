import { FunctionalComponent, h } from "preact";
import {
  useCallback,
  useContext,
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
import { UserContext } from "src/contexts";
import { MainContent, StdLayout } from "src/components/StdLayout";

const AddPostScreen = ({
  communityId: communityIdStr,
}: {
  communityId: string;
}) => {
  const communityId = useMemo(() => parseInt(communityIdStr), [communityIdStr]);

  const [user] = useContext(UserContext);

  const createPostCb = useCallback(
    async (values: Values) => {
      if (!user) {
        throw new Error("must be logged in to create a post");
      }
      try {
        await createPost(user, {
          ...values,
          communities: [communityId],
        });
      } finally {
        route(`${URLS.pages.communities}/${communityIdStr}`);
      }
    },
    [communityId]
  );

  return (
    <StdLayout>
      <MainContent>
        <PostDialog onSubmit={createPostCb} />
      </MainContent>
    </StdLayout>
  );
};

export default AddPostScreen;
