import { CommunityWithSubStatus } from "src/types/types";
import { URLS } from "src/urls";
import { execInternalReq, HttpMethod } from "src/utils/request";

const basePath = URLS.api.subscriptions;

export async function subscribe(subChanges: {
  [communityId: string]: boolean;
}): Promise<CommunityWithSubStatus> {
  return execInternalReq(`${basePath}`, {
    method: HttpMethod.POST,
    body: subChanges,
  });
}
