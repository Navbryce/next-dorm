import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "preact/compat";
import { editPost, getPost } from "src/actions/Post";
import { Post } from "src/types/types";
import EditPostDialog, { Values } from "src/components/inputs/EditPostDialog";
import { diff } from "src/utils/diff";
import { UserContext } from "src/contexts";
import { route } from "preact-router";
import { genLinkToCommunity, genLinkToPost } from "src/urls";
import { canModifyPost } from "src/actions/user-parse";
import StdLayout, {
  BackButton,
  MainContent,
  Title,
} from "src/components/StdLayout";

const EditPostScreen = ({
  communityId: communityIdStr,
  postId: postIdStr,
}: {
  communityId: string;
  postId: string;
}) => {
  const [user] = useContext(UserContext);
  const postId = useMemo(() => parseInt(postIdStr), [postIdStr]);
  const [post, setPost] = useState<Post | undefined>(undefined);

  useEffect(() => {
    (async () => {
      const post = await getPost(postId);
      // TODO: Move permission check to router?
      if (!canModifyPost(user, post)) {
        route("/");
        return;
      }
      setPost(post);
    })();
  }, [postId]);

  const onEditPostCb = useCallback(
    ({ title, content, imageBlobNames, visibility }: Values) => {
      if (!user) {
        throw new Error("Must be logged into to edit a post");
      }
      if (!post) {
        throw new Error("Cannot edit post before it has been loaded");
      }
      const postDiff = diff(
        {
          content: post.content,
          title: post.title,
          imageBlobNames: post.imageBlobNames,
        },
        {
          title,
          content,
          imageBlobNames,
          visibility, // always include new visibility currently
        }
      );
      editPost(user, post.id, postDiff).then(() => route(genLinkToPost(post)));
    },
    [post]
  );

  if (!post) {
    return <div />;
  }

  return (
    <StdLayout>
      <MainContent>
        <BackButton url={genLinkToCommunity(post.id)} />
        <Title>Edit post</Title>
        <p>Now's the time to fix that typo</p>
        <EditPostDialog initialValues={post} onSubmit={onEditPostCb} />
      </MainContent>
    </StdLayout>
  );
};

export default EditPostScreen;
