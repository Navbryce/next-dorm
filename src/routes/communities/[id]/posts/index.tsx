import { h } from "preact";
import { useEffect, useMemo, useState } from "preact/compat";
import { getPost } from "src/actions/Post";
import { Post } from "src/types/types";
import PostComponent from "src/components/Post";
import StdLayout, { BackButton, MainContent } from "src/components/StdLayout";

const PostScreen = ({
  communityId: communityIdStr,
  postId: postIdStr,
}: {
  communityId: string;
  postId: string;
}) => {
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
      <MainContent>
        <BackButton />
        <PostComponent post={post} />
      </MainContent>
    </StdLayout>
  );
};

export default PostScreen;
