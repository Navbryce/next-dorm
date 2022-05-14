import { useState } from "preact/compat";
import type { Post } from "../types/types";
import { classNames } from "../utils/styling";
import { PostVoteCounter } from "./VoteCounter";
import { route } from "preact-router";
import { genLinkToCommunity, genLinkToPost } from "src/urls";
import UploadedLazyLoadImage from "src/components/LazyUploadedImage";
import { ProfileCardSm } from "src/components/ProfileCard";
import { timeToDisplayStr } from "src/utils/display";
import { ExclamationCircleIcon } from "@heroicons/react/solid";

type Props = {
  posts: Post[];
  noPostsMessage?: string;
};

const PostsList = ({ posts, noPostsMessage }: Props) => {
  const [selected, setSelected] = useState<Post | null>(null);

  return (
    <div class="divide-y-2 divide-secondary-400">
      <div>
        {posts.length == 0 && (
          <div className="flex items-center">
            <ExclamationCircleIcon width={25} height={25} className="inline" />
            {noPostsMessage ?? "No posts"}
          </div>
        )}
        {posts.map((post) => (
          <div
            key={post.id}
            class={classNames(
              "p-6 cursor-pointer border-b border-secondary-100",
              selected == post ? "bg-primary-600" : ""
            )}
          >
            <div className="flex space-x-5">
              <PostVoteCounter post={post} />
              <div
                className="flex-grow"
                onClick={() => route(genLinkToPost(post))}
              >
                <ProfileCardSm user={post.creator} />
                <div>{post.title}</div>
                <div className="text-gray-400 text-[11pt]">
                  <span className="text-gray-400">
                    {timeToDisplayStr(post.createdAt)}
                  </span>
                  <a
                    href={genLinkToCommunity(post.communities[0])}
                    className="hover:underline"
                  >
                    <span className="italic">
                      {" "}
                      @ {post.communities[0].name}
                    </span>
                  </a>
                </div>
                <div>
                  {post.imageBlobNames.length > 0 && (
                    <UploadedLazyLoadImage
                      blobName={post.imageBlobNames[0]}
                      className="max-w-screen-sm max-h-[350px] object-contain rounded"
                    />
                  )}
                </div>
                <div>{post.commentCount} Comments</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostsList;
