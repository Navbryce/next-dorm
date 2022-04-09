import { getAuth, User as FirebaseUser } from "firebase/auth";
import { DisplayableUserRes } from "../types/types";

export function currentUserToDisplayable(): DisplayableUserRes {
  const { uid, displayName, photoURL } = getAuth().currentUser as FirebaseUser;
  return {
    user: {
      id: uid,
      displayName: displayName ?? "not found",
      avatar: photoURL ?? "not found",
    },
  };
}
