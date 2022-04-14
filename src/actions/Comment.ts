import { URLS } from "../urls";
import { execInternalReq, HttpMethod } from "../utils/request";
import { Comment, CommentRes, User } from "../types/types";
import { userToDisplayable } from "../utils/auth";
import { makeCMDisplayable } from "src/actions/util";

// TODO: Update how this calculated
function basePathForPost(postId: number): string {
  return `${URLS.api.posts}/${postId}/comments`;
}

export async function getComments(postId: number): Promise<Comment[]> {
  const comments = await execInternalReq<CommentRes[]>(
    basePathForPost(postId),
    {
      method: HttpMethod.GET,
      queryParams: { limit: 100 },
    }
  );
  return comments.map(makeCMDisplayable);
}

type CreateCommentReq = Pick<Comment, "content" | "visibility"> & {
  parentCommentId?: number | null;
};

export async function createComment(
  currentUser: User,
  postId: number,
  req: CreateCommentReq
): Promise<Comment> {
  const { id } = await execInternalReq<{ id: number }>(
    basePathForPost(postId),
    {
      method: HttpMethod.PUT,
      body: req,
    }
  );
  return {
    id,
    children: [],
    voteTotal: 0,
    userVote: { value: 0 },
    creator: userToDisplayable(currentUser),
    ...req,
  };
}
