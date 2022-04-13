import { h } from "preact";
import { useState } from "preact/compat";
import type { Post } from "../types/types";
import { classNames } from "../utils/styling";
import { PostVoteCounter } from "./VoteCounter";
import { toDisplayableUser } from "src/model/DisplayableUser";
import { route } from "preact-router";
import { genLinkToPost } from "src/urls";

type Props = {
  posts: Post[];
};

const PostsList = ({ posts }: Props) => {
  const [selected, setSelected] = useState<Post | null>(null);

  return (
    <div class="divide-y-2 divide-secondary-400">
      <div>
        {posts.map((post) => (
          <div
            key={post.id}
            class={classNames(
              "p-4 cursor-pointer",
              selected == post ? "bg-primary-600" : ""
            )}
            onClick={() => route(genLinkToPost(post))}
          >
            <div class="flex space-x-5">
              <PostVoteCounter post={post} />
              <div class="flex-grow">
                {post.title} -{" "}
                <span>
                  {post.communities.map((community) => community.name)}
                </span>
                <div>by {toDisplayableUser(post.creator).displayName}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostsList;
