import { URLS } from "../urls";
import { execInternalReq, HttpMethod } from "../utils/request";
import {
  CursorType,
  Post,
  PostCursor,
  PostPage,
  PostRes,
  Status,
  User,
} from "../types/types";
import { currentUserToKnownContentAuthor } from "src/actions/user-parse";
import {
  makePostDisplayable,
  makePostPageDisplayable,
} from "src/actions/parse";
import dayjs from "dayjs";
import { Diff } from "src/utils/diff";

const postsPath = URLS.api.posts;

export async function getPost(id: number): Promise<Post> {
  const post = await execInternalReq<PostRes>(`${postsPath}/${id}`, {
    method: HttpMethod.GET,
  });
  return makePostDisplayable(post);
}

export async function getPosts(
  cursorType: CursorType,
  cursor?: PostCursor
): Promise<PostPage> {
  const page = await execInternalReq<{
    posts: PostRes[];
    nextCursor: PostCursor;
  }>(postsPath, {
    method: HttpMethod.POST,
    body: {
      cursorType,
      cursor,
    },
  });
  return makePostPageDisplayable(page);
}

type CreatePostReq = Pick<
  Post,
  "title" | "content" | "visibility" | "imageBlobNames"
> & {
  communities: number[];
};

export async function createPost(
  user: User,
  req: CreatePostReq
): Promise<Post> {
  const { id } = await execInternalReq<{ id: number; alias: string }>(
    `${postsPath}`,
    {
      method: HttpMethod.PUT,
      body: req,
    }
  );
  return {
    status: Status.POSTED,
    id,
    creator: currentUserToKnownContentAuthor(user),
    voteTotal: 0,
    userVote: {
      value: 0,
    },
    ...req,
    communities: [], // TODO: Properly populate communities
    commentCount: 0,
    createdAt: dayjs(),
    updatedAt: dayjs(),
  };
}

type EditPostReq = Diff<
  Pick<Post, "title" | "content" | "imageBlobNames" | "visibility">
>;

export async function editPost(user: User, id: number, req: EditPostReq) {
  return execInternalReq<void>(`${postsPath}/${id}`, {
    method: HttpMethod.PUT,
    body: req,
  });
}

export async function deletePost(user: User, id: number): Promise<void> {
  await execInternalReq<{ id: number }>(`${postsPath}/${id}`, {
    method: HttpMethod.DELETE,
  });
}

export async function vote(id: number, value: number): Promise<void> {
  return execInternalReq(`${postsPath}/${id}/votes`, {
    method: HttpMethod.PUT,
    body: { value },
  });
}
