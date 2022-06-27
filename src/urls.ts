import { Community, KnownContentAuthor, LocalUser, Post } from "./types/types";
import { ALL_COMMUNITY } from "src/model/community";

export const URLS = {
  feRoot: process.env.FE_URL as string,
  api: {
    base: process.env.API_URL,
    communities: "/communities",
    feed: "/feeds",
    posts: "/posts",
    subscriptions: "/subscriptions",
    users: "/users",
  },
  pages: {
    all: "/",
    about: "/about",
    feed: "/feed",
    communities: "/comm",
    users: {
      root: "/users",
      createProfile: "/users/create-profile",
      forgotPassword: "/users/forgot-password",
      signIn: "/users/sign-in",
      register: "/users/register",
      settings: "/users/settings",
      verify: "/users/verify",
    },
  },
};

// TODO: Add wrapper around Communitya and move into own class?
export function genLinkToCommunity(
  community: Community | string | number
): string {
  if (community == ALL_COMMUNITY || community == -1 || community == "-1") {
    return URLS.pages.all;
  }
  let communityId;
  if (typeof community == "object") {
    communityId = community.id;
  } else {
    communityId = community;
  }
  return `${URLS.pages.communities}/${communityId}`;
}

export function genLinkToPost(post: Post): string {
  // TODO just use the first community of the post for now
  return `${URLS.pages.communities}/${post.communities[0].id}/posts/${post.id}`;
}

export function genLinkToEditPost(post: Post): string {
  return `${genLinkToPost(post)}/edit`;
}

export function genLinkToUser(user: LocalUser | KnownContentAuthor): string {
  // TODO just use the first community of the post for now
  return `${URLS.pages.users.root}/${user.id}`;
}
