import { URLS } from "../urls";
import { execInternalReq, HttpMethod } from "src/utils/request";
import { Profile } from "src/types/types";

// TODO: Rename profile to AppUser and User to FirebaseUser
export async function getProfile(): Promise<Profile | null> {
  return execInternalReq(URLS.api.users, {
    method: HttpMethod.GET,
  });
}

export async function createProfile(req: {
  displayName: string;
  avatar?: string;
}): Promise<Profile | null> {
  return execInternalReq(URLS.api.users, {
    method: HttpMethod.PUT,
    body: req,
  });
}
