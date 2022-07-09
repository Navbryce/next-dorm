import { h } from "preact";
import { useContext, useEffect, useMemo, useState } from "preact/compat";
import { getPost } from "src/actions/Post";
import { Post } from "src/types/types";
import PostComponent from "src/components/Post";
import StdLayout, {
  BackButton,
  MainContent,
  Toolbar,
} from "src/components/StdLayout";
import { ReferringScreenContext } from "src/contexts";
import { genLinkToCommunity } from "src/urls";

const PostScreen = ({
  communityId: communityIdStr,
  postId: postIdStr,
}: {
  communityId: string;
  postId: string;
}) => {
  const [referringScreenURL] = useContext(ReferringScreenContext);
  const postId = useMemo(() => parseInt(postIdStr), [postIdStr]);
  const [post, setPost] = useState<Post | undefined>(undefined);

  useEffect(() => {
    (async () => {
      setPost(await getPost(postId));
    })();
  }, [postId]);

  if (!post) {
    return <div />;
  }

  return (
    <StdLayout>
      <Toolbar />
      <MainContent>
        <div className="mx-6">
          <BackButton
            url={
              referringScreenURL ?? genLinkToCommunity(post.communities[0].id)
            }
          />
          <PostComponent post={post} />
        </div>
      </MainContent>
      <Toolbar />
    </StdLayout>
  );
};

export default PostScreen;
