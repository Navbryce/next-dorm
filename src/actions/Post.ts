import { URLS } from "../urls";
import { execInternalReq, HttpMethod } from "../utils/request";
import {
  Post,
  PostCursor,
  PostPage,
  PostRes,
  User,
  Visibility,
} from "../types/types";
import { userToDisplayable } from "src/utils/user";
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

export async function getPosts(cursor?: PostCursor): Promise<PostPage> {
  const page = await execInternalReq<{
    posts: PostRes[];
    nextCursor: PostCursor;
  }>(postsPath, {
    method: HttpMethod.POST,
    body: {
      orderBy: "MOST_RECENT",
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
  const { id } = await execInternalReq<{ id: number }>(`${postsPath}`, {
    method: HttpMethod.PUT,
    body: req,
  });
  return {
    id,
    creator: userToDisplayable(user),
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

type EditPostReq = Diff<{
  title: string;
  content: string;
  imageBlobNames: string[];
  visibility: Visibility;
}>;

export async function editPost(
  user: User,
  id: number,
  req: EditPostReq
): Promise<void> {
  await execInternalReq<{ id: number }>(`${postsPath}/${id}`, {
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
