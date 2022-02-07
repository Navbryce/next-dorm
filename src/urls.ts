import { Community } from "./model/types";

export const URLS = {
  api: {
    base: process.env.API_URL,
    communities: "/communities",
    posts: "/posts",
  },
  pages: {
    signIn: "/sign-in",
    communities: "/communities",
  },
};

// TODO: Add wrapper around Communitya and move into own class?
export function genLinkToCommunity(community: Community): string {
  return `${URLS.pages.communities}/${community.id}`;
}
