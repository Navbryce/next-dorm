import { FunctionalComponent, h } from "preact";
import { useEffect, useState } from "preact/compat";
import type { Post } from "../types/types";
import { getPosts } from "../actions/Post";
import PostComponent from "./Post";
import { classNames } from "../utils/styling";
import { PostVoteCounter } from "./VoteCounter";
import { toDisplayableUser } from "src/model/DisplayableUser";

type Props = {
  posts: Post[];
};

const PostsList = ({ posts }: Props) => {
  const [selected, setSelected] = useState<Post | null>(null);

  return (
    <div class={"divide-y-2 divide-secondary-400"}>
      <div>
        {posts.map((post) => (
          <div
            key={post.id}
            class={classNames(
              "p-4 cursor-pointer",
              selected == post ? "bg-primary-600" : ""
            )}
            onClick={() => setSelected(post)}
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
  {
    /*<div class="absolute h-full w-5/6">*/
  }
  {
    /*  {selected && <PostComponent post={selected}/>}*/
  }
  {
    /*</div>*/
  }
};

export default PostsList;
