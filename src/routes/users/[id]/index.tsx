import { h } from "preact";
import { useCallback, useEffect, useState } from "preact/compat";
import {
  CursorType,
  KnownContentAuthor,
  Post,
  PostCursor,
} from "src/types/types";
import InfinitePostsList from "src/components/InfinitePostsList";
import { getPosts } from "src/actions/Post";
import { getContentAuthor } from "src/actions/User";
import { Avatar } from "src/components/ProfileCard";
import { SortBy } from "src/components/inputs/SortSelect";
import StdLayout, { MainContent } from "src/components/StdLayout";

const UserScreen = ({ userId }: { userId: string }) => {
  const [posts, setPosts] = useState<Post[]>();
  const [user, setUser] = useState<KnownContentAuthor | null | undefined>(
    undefined
  );
  const [cursorType, setCursorType] = useState<CursorType>(
    CursorType.MOST_RECENT
  );

  const onSortChangeCb = useCallback(
    (sortBy: SortBy) => {
      setCursorType(
        sortBy == SortBy.MOST_RECENT
          ? CursorType.MOST_RECENT
          : CursorType.MOST_POPULAR
      );
    },
    [setCursorType]
  );

  useEffect(() => {
    (async () => {
      setUser(await getContentAuthor(userId));
    })();
  }, [setUser, userId]);

  const fetchNextPageCb = useCallback(
    (previousCursor?: PostCursor) => {
      return getPosts(
        cursorType,
        previousCursor ?? {
          byUser: {
            id: userId,
          },
        }
      );
    },
    [userId, cursorType]
  );

  if (user === undefined) {
    return <div />;
  }

  if (user === null) {
    return <div>User does not exist</div>;
  }

  return (
    <StdLayout>
      <MainContent>
        <div class="flex items-center divider-b">
          <Avatar user={user} width={100} height={100} />
          <h1>{user.displayName}</h1>
        </div>
        <InfinitePostsList
          fetchNextPage={fetchNextPageCb}
          posts={posts}
          setPosts={setPosts}
          onSortChange={onSortChangeCb}
        />
      </MainContent>
    </StdLayout>
  );
};

export default UserScreen;
