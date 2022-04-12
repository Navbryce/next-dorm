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

const AddPostScreen = ({
  communityId: communityIdStr,
}: {
  communityId: string;
}) => {
  const communityId = useMemo(() => parseInt(communityIdStr), [communityIdStr]);

  const createPostCb = useCallback(
    async (values: Values) => {
      try {
        await createPost({
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
    <div class="relative w-full h-full">
      <div class="absolute h-full w-full z-10">
        <PostDialog onSubmit={createPostCb} />
      </div>
    </div>
  );
};

export default AddPostScreen;
