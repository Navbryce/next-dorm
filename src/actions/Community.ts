import { CommunityWithSubStatus } from "src/types/types";
import { URLS } from "src/urls";
import { execInternalReq, HttpMethod } from "src/utils/request";

const basePath = URLS.api.communities;

export async function getCommunity(
  id: number
): Promise<CommunityWithSubStatus> {
  return execInternalReq(`${basePath}/${id}`, {
    method: HttpMethod.GET,
  });
}

export async function getCommunities(): Promise<CommunityWithSubStatus[]> {
  return execInternalReq(`${basePath}`, {
    method: HttpMethod.GET,
  });
}
