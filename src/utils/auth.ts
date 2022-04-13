import { DisplayableUserRes, User } from "../types/types";

export function userToDisplayable(user: User): DisplayableUserRes {
  return {
    user: {
      id: user.firebaseUser.uid,
      displayName: user.profile?.displayName ?? "not found",
      avatar: user.profile?.avatar ?? "not found",
    },
  };
}
