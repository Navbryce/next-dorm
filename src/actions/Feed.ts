import { URLS } from "src/urls";
import { PostCursor, PostPageRes, PostPage } from "src/types/types";
import { execInternalReq, HttpMethod } from "src/utils/request";
import { makePostPageDisplayable } from "src/actions/parse";

const basePath = URLS.api.feed;

export async function getFeed(cursor?: PostCursor): Promise<PostPage> {
  const page = await execInternalReq<PostPageRes>(basePath, {
    method: HttpMethod.POST,
    body: {
      orderBy: "MOST_RECENT",
      cursor,
    },
  });
  return makePostPageDisplayable(page);
}
