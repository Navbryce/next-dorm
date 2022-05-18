import {
  Community,
  CommunityPosInTree,
  CommunityWithSubStatus,
} from "src/types/types";
import { URLS } from "src/urls";
import { execInternalReq, HttpMethod } from "src/utils/request";
import { ALL_COMMUNITY } from "src/model/community";

const basePath = URLS.api.communities;

export async function getCommunity(
  id: number
): Promise<CommunityWithSubStatus> {
  return execInternalReq(`${basePath}/${id}`, {
    method: HttpMethod.GET,
  });
}

function normalizePos(pos: CommunityPosInTree): CommunityPosInTree {
  return {
    ...pos,
    path: pos.path.length == 0 ? [] : [ALL_COMMUNITY, ...pos.path.slice(1)],
  };
}

export async function getCommunityPos(
  id?: number
): Promise<CommunityPosInTree> {
  // treat null as 0
  return normalizePos(
    await execInternalReq(`${basePath}/${id ?? -1}/pos`, {
      method: HttpMethod.GET,
    })
  );
}
