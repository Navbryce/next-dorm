import { Community, KnownContentAuthor, LocalUser, Post } from "./types/types";

export const URLS = {
  api: {
    base: process.env.API_URL,
    communities: "/communities",
    feed: "/feeds",
    posts: "/posts",
    subscriptions: "/subscriptions",
    users: "/users",
  },
  pages: {
    communities: "/communities",
    users: {
      root: "/users",
      createProfile: "/users/create-profile",
      forgotPassword: "/users/forgot-password",
      signIn: "/users/sign-in",
      register: "/users/register",
      settings: "/users/settings",
    },
  },
};

// TODO: Add wrapper around Communitya and move into own class?
export function genLinkToCommunity(community: Community): string {
  return `${URLS.pages.communities}/${
    community.id > -1 ? community.id : community.name.toLowerCase()
  }`;
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
