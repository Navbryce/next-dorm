import { URLS } from "../urls";
import { Post, PostCursor, PostPage } from "../types/types";
import { execInternalReq, HttpMethod } from "../utils/request";

const basePath = URLS.api.feed;

export function getFeed(cursor?: PostCursor): Promise<PostPage> {
  return execInternalReq(basePath, {
    method: HttpMethod.POST,
    body: {
      orderBy: "MOST_RECENT",
      cursor: cursor,
    },
  });
}
