import { URLS } from "../urls";
import { execInternalReq, HttpMethod } from "../utils/request";
import { Post, PostCursor, PostPage, PostRes, User } from "../types/types";
import { userToDisplayable } from "../utils/auth";
import { makePostDisplayable, makePostPageDisplayable } from "src/actions/util";

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

type CreatePostReq = Pick<Post, "title" | "content" | "visibility"> & {
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
  };
}

export async function vote(id: number, value: number): Promise<void> {
  return execInternalReq(`${postsPath}/${id}/votes`, {
    method: HttpMethod.PUT,
    body: { value },
  });
}
