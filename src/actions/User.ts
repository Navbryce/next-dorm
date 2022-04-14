import { URLS } from "../urls";
import { execInternalReq, HttpMethod } from "src/utils/request";
import {
  DisplayableUser,
  KnownDisplayableUser,
  LocalUser,
} from "src/types/types";

// TODO: Rename profile to AppUser and User to FirebaseUser
export async function getLocalUser(): Promise<LocalUser | null> {
  return execInternalReq(URLS.api.users, {
    method: HttpMethod.GET,
  });
}

export async function getUser(
  id: string
): Promise<KnownDisplayableUser | null> {
  return execInternalReq(`${URLS.api.users}/${id}`, {
    method: HttpMethod.GET,
  });
}

export async function createProfile(req: {
  displayName: string;
  avatar?: string;
}): Promise<LocalUser | null> {
  return execInternalReq(URLS.api.users, {
    method: HttpMethod.PUT,
    body: req,
  });
}
