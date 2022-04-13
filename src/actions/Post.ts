import { URLS } from "../urls";
import { execInternalReq, HttpMethod } from "../utils/request";
import { Post, PostCursor, PostPage } from "../types/types";
import { userToDisplayable } from "../utils/auth";

const postsPath = URLS.api.posts;

export async function getPost(id: number): Promise<Post> {
  return execInternalReq(`${postsPath}/${id}`, {
    method: HttpMethod.GET,
  });
}

export async function getPosts(cursor?: PostCursor): Promise<PostPage> {
  return execInternalReq(postsPath, {
    method: HttpMethod.POST,
    body: {
      orderBy: "MOST_RECENT",
      cursor,
    },
  });
}

type CreatePostReq = Pick<Post, "title" | "content" | "visibility"> & {
  communities: number[];
};

export async function createPost(req: CreatePostReq): Promise<Post> {
  const { id } = await execInternalReq<{ id: number }>(`${postsPath}`, {
    method: HttpMethod.PUT,
    body: req,
  });
  return {
    id,
    creator: userToDisplayable(),
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
