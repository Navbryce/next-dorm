import { h } from "preact";
import { useCallback, useContext, useEffect, useState } from "preact/compat";
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
import { Sort, SortBy } from "src/components/inputs/SortSelect";
import StdLayout, { MainContent } from "src/components/StdLayout";
import { ReferringScreenContext } from "src/contexts";

const UserScreen = ({ userId }: { userId: string }) => {
  const [, setReferringScreenURL] = useContext(ReferringScreenContext);
  const [posts, setPosts] = useState<Post[]>();
  const [user, setUser] = useState<KnownContentAuthor | null | undefined>(
    undefined
  );
  const [sort, setSort] = useState<Sort>({ sortBy: SortBy.MOST_RECENT });

  useEffect(() => {
    (async () => {
      setUser(await getContentAuthor(userId));
    })();
    setReferringScreenURL(userId);
  }, [setUser, userId, setReferringScreenURL]);

  const fetchNextPageCb = useCallback(
    (previousCursor?: PostCursor) => {
      const cursorType =
        sort.sortBy == SortBy.MOST_RECENT
          ? CursorType.MOST_RECENT
          : CursorType.MOST_POPULAR;

      return getPosts(
        cursorType,
        previousCursor ?? {
          byUser: {
            id: userId,
          },
          since: sort.since,
        }
      );
    },
    [userId, sort]
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
        <div className="flex items-center divider-b pb-5 my-5 space-x-2">
          <Avatar user={user} width={100} height={100} />
          <h1>{user.displayName}</h1>
        </div>
        <InfinitePostsList
          fetchNextPage={fetchNextPageCb}
          posts={posts}
          setPosts={setPosts}
          onSortChange={setSort}
        />
      </MainContent>
    </StdLayout>
  );
};

export default UserScreen;
