import { Community, Post } from "./types/types";

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
    user: {
      createProfile: "/user/create-profile",
      signIn: "/user/sign-in",
      register: "/user/register",
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
