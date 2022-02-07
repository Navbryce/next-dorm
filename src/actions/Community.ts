import { Community } from "../model/types";
import { URLS } from "../urls";
import { execInternalReq, HttpMethod } from "../utils/request";

const basePath = URLS.api.communities;

export async function getCommunity(id: number): Promise<Community> {
  return execInternalReq(`${basePath}/${id}`, {
    method: HttpMethod.GET,
  });
}

export async function getCommunities(): Promise<Community[]> {
  return execInternalReq(`${basePath}`, {
    method: HttpMethod.GET,
  });
}
