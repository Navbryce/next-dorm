import { h } from "preact";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "preact/compat";
import { KnownDisplayableUser, Post, PostCursor } from "src/types/types";
import InfinitePostsList from "src/components/InfinitePostsList";
import { getPosts } from "src/actions/Post";
import { getUser } from "src/actions/User";
import { Avatar } from "src/components/ProfileCard";

const UserScreen = ({ userId }: { userId: string }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<KnownDisplayableUser | null | undefined>(
    undefined
  );

  useEffect(() => {
    (async () => {
      setUser(await getUser(userId));
    })();
  }, [setUser, userId]);

  const fetchNextPageCb = useCallback(
    (previousCursor?: PostCursor) => {
      return getPosts(
        previousCursor ?? {
          byUser: {
            id: userId,
          },
        }
      );
    },
    [userId]
  );

  if (user === undefined) {
    return <div />;
  }

  if (user === null) {
    return <div>User does not exist</div>;
  }

  return (
    <div>
      <div class="flex items-center divider-b">
        <Avatar user={user} width={100} height={100} />
        <h1>{user.displayName}</h1>
      </div>
      <InfinitePostsList
        fetchNextPage={fetchNextPageCb}
        posts={posts}
        setPosts={setPosts}
      />
    </div>
  );
};

export default UserScreen;
