import {
  DisplayableUser,
  DisplayableUserRes,
  KnownDisplayableUser,
  User,
} from "../types/types";

export function userToDisplayable(user: User): KnownDisplayableUser {
  return {
    id: user.firebaseUser.uid,
    displayName: user.profile?.displayName ?? "not found",
    avatar: user.profile?.avatar ?? "not found",
  };
}

export function toDisplayableUser(user: DisplayableUserRes): DisplayableUser {
  return "user" in user
    ? (user.user as KnownDisplayableUser)
    : (user.anonymousUser as DisplayableUser);
}
