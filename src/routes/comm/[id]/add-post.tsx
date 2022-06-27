import { useCallback, useContext, useMemo } from "preact/compat";
import { createPost } from "src/actions/Post";
import PostDialog, { Values } from "src/components/inputs/PostDialog";
import { route } from "preact-router";
import { genLinkToCommunity, URLS } from "src/urls";
import { UserContext } from "src/contexts";
import {
  BackButton,
  MainContent,
  StdLayout,
  Title,
  withStandardPageElements,
} from "src/components/StdLayout";
import { withAuth } from "src/components/wrappers/Auth";

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
        <BackButton url={genLinkToCommunity(communityId)} />
        <Title>Write your post!</Title>
        <p>This is your time to complain or to point someting weird out.</p>
        <PostDialog onSubmit={createPostCb} />
      </MainContent>
    </StdLayout>
  );
};

export default withAuth(withStandardPageElements(AddPostScreen), {
  requireProfile: true,
});
