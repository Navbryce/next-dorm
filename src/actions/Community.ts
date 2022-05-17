import {
  Community,
  CommunityPosInTree,
  CommunityWithSubStatus,
} from "src/types/types";
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

export async function getCommunityPos(
  id?: number
): Promise<CommunityPosInTree> {
  // treat null as 0
  return execInternalReq(`${basePath}/${id ?? -1}/pos`, {
    method: HttpMethod.GET,
  });
}
