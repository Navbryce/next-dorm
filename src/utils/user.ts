import {
  AnonymousUserRes,
  ContentMetadata,
  DisplayableUser,
  DisplayableUserRes,
  KnownDisplayableUser,
  Post,
  User,
} from "../types/types";
import { getAuth } from "firebase/auth";

export function userToDisplayable(user: User): KnownDisplayableUser {
  return {
    id: user.firebaseUser.uid,
    displayName: user.profile?.displayName ?? "not found",
    avatar: user.profile?.avatar ?? "not found",
  };
}

export function toDisplayableUser(
  userRes: DisplayableUserRes
): DisplayableUser {
  if (!("anonymousUser" in userRes)) {
    return userRes.user as KnownDisplayableUser;
  }

  if (!("user" in userRes)) {
    return userRes.anonymousUser as DisplayableUser;
  }

  const { user, anonymousUser } = userRes;
  return {
    ...user,
    displayName: `${user.displayName} (as ${anonymousUser.displayName})`,
  };
}

function canModifyCm(user: User | null | undefined, cm: ContentMetadata) {
  if (!user) {
    return false;
  }
  // Add admin check
  if (!("id" in cm.creator)) {
    return false;
  }

  return (cm.creator as KnownDisplayableUser).id == user.firebaseUser.uid;
}

export function canModifyPost(user: User | null | undefined, post: Post) {
  return canModifyCm(user, post);
}
