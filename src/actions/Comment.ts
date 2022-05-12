import { URLS } from "../urls";
import { execInternalReq, HttpMethod } from "../utils/request";
import {
  Alias,
  Comment,
  CommentRes,
  Creator,
  Status,
  User,
} from "../types/types";
import { currentUserToKnownContentAuthor } from "src/actions/user-parse";
import { makeCommentDisplayable } from "src/actions/parse";
import dayjs from "dayjs";
import { Diff } from "src/utils/diff";

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
  return comments.map(makeCommentDisplayable);
}

type CreateCommentReq = Pick<Comment, "content" | "visibility"> & {
  parentCommentId?: number | null;
};

export async function createComment(
  user: User,
  postId: number,
  req: CreateCommentReq
): Promise<Comment> {
  const { id, alias } = await execInternalReq<{ id: number; alias: Alias }>(
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
    creator: currentUserToKnownContentAuthor(user, alias),
    imageBlobNames: [],
    ...req,
    createdAt: dayjs(),
    updatedAt: dayjs(),
    status: Status.POSTED,
  };
}

type EditCommentReq = Diff<Pick<Comment, "content" | "visibility">>;

export async function editComment(
  user: User,
  postId: number,
  commentId: number,
  req: EditCommentReq
) {
  return currentUserToKnownContentAuthor(
    user,
    (
      await execInternalReq<{ alias?: Alias }>(
        `${basePathForPost(postId)}/${commentId}`,
        {
          method: HttpMethod.PUT,
          body: req,
        }
      )
    ).alias
  );
}

export async function deleteComment(
  user: User,
  postId: number,
  commentId: number
): Promise<void> {
  return execInternalReq<void>(`${basePathForPost(postId)}/${commentId}`, {
    method: HttpMethod.DELETE,
  });
}
