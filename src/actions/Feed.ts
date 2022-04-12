import { URLS } from "src/urls";
import { Post, PostCursor, PostPage } from "src/types/types";
import { execInternalReq, HttpMethod } from "src/utils/request";

const basePath = URLS.api.feed;

export function getFeed(cursor?: PostCursor): Promise<PostPage> {
  return execInternalReq(basePath, {
    method: HttpMethod.POST,
    body: {
      orderBy: "MOST_RECENT",
      cursor,
    },
  });
}
