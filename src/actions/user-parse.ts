import {
  Alias,
  Comment,
  ContentAuthorRes,
  ContentMetadata,
  Creator,
  KnownContentAuthor,
  LocalUser,
  Post,
  User,
} from "src/types/types";

export function currentUserToKnownContentAuthor(
  currentUser: User,
  alias?: Alias
): KnownContentAuthor {
  if (!currentUser.profile) {
    throw new Error("user must be logged in");
  }
  return knownContentAuthorWithAlias(
    localUserToKnownContentAuthor(currentUser.profile),
    alias
  );
}

export function localUserToKnownContentAuthor(
  user: LocalUser,
  alias?: Alias
): KnownContentAuthor {
  return knownContentAuthorWithAlias(
    {
      id: user.id,
      displayName: user.displayName,
      avatar: { blobName: user.avatarBlobName },
    },
    alias
  );
}

export function parseContentAuthorRes(userRes: ContentAuthorRes): Creator {
  if (!("user" in userRes)) {
    const alias = userRes.anonymousUser as Alias;
    return {
      displayName: alias.displayName,
      avatar: { url: userRes.anonymousUser.avatarUrl },
    };
  }

  const { user, anonymousUser: alias } = userRes;
  return knownContentAuthorWithAlias(
    {
      id: user.id,
      displayName: user.displayName,
      avatar: { blobName: user.avatarBlobName },
    },
    alias as Alias
  );
}

function knownContentAuthorWithAlias(
  user: KnownContentAuthor,
  aliasMaybe?: Alias
) {
  if (!aliasMaybe) {
    return user;
  }
  return {
    ...user,
    displayName: `${user.displayName} (as ${aliasMaybe.displayName})`,
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

  return (cm.creator as KnownContentAuthor).id == user.firebaseUser.uid;
}

export function canModifyPost(user: User | null | undefined, post: Post) {
  return canModifyCm(user, post);
}

export function canModifyComment(
  user: User | null | undefined,
  comment: Comment
) {
  return canModifyCm(user, comment);
}
