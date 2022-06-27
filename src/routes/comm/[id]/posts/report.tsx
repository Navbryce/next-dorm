import { withAuth } from "src/components/wrappers/Auth";
import { useCallback, useEffect, useMemo, useState } from "preact/compat";
import { getPost } from "src/actions/Post";
import { Post } from "src/types/types";
import { route } from "preact-router";
import ReportDialog, { ReportForm } from "src/components/inputs/ReportDialog";
import StdLayout, { MainContent, Title } from "src/components/StdLayout";

type Props = {
  communityId: string;
  postId: string;
};

const ReportPostScreen = ({
  communityId: communityIdStr,
  postId: postIdStr,
}: Props) => {
  const postId = useMemo(() => parseInt(postIdStr), [postIdStr]);
  const [post, setPost] = useState<Post | undefined>(undefined);
  useEffect(() => {
    (async () => {
      const post = await getPost(postId);
      // TODO: Move permission check to router?
      if (!post) {
        route("/");
        throw new Error("post does not exist");
      }
      setPost(post);
    })();
  });

  const onSubmitCb = useCallback(
    (report: ReportForm) => {
      console.log(report);
    },
    [postId]
  );

  return (
    <StdLayout>
      <MainContent>
        <Title>Report Post</Title>
        <ReportDialog onSubmit={onSubmitCb} />
      </MainContent>
    </StdLayout>
  );
};

export default withAuth(ReportPostScreen, {
  requireProfile: true,
});
