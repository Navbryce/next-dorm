import { URLS } from "../urls";
import { execInternalReq, HttpMethod } from "src/utils/request";
import { KnownContentAuthor, LocalUser } from "src/types/types";
import { localUserToKnownContentAuthor } from "src/actions/user-parse";

// TODO: Rename profile to AppUser and User to FirebaseUser
export async function getCurrentLocalUser(): Promise<LocalUser | null> {
  return execInternalReq(URLS.api.users, {
    method: HttpMethod.GET,
  });
}

export async function getContentAuthor(
  id: string
): Promise<KnownContentAuthor | null> {
  return localUserToKnownContentAuthor(
    await execInternalReq(`${URLS.api.users}/${id}`, {
      method: HttpMethod.GET,
    })
  );
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
