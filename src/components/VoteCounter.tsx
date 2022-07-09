import { FunctionalComponent } from "preact";

import { Comment, ContentMetadata, Post } from "../types/types";
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/solid";
import { useCallback, useContext, useState } from "preact/compat";
import { vote as voteForPost } from "../actions/Post";
import { vote as voteForComment } from "../actions/Comment";
import { classNames } from "../utils/styling";
import { UserContext } from "src/contexts";
import { route } from "preact-router";
import { URLS } from "src/urls";

type Props = {
  content: ContentMetadata;
  onVote: (vote: number) => Promise<void>;
};
const VoteCounter: FunctionalComponent<Props> = ({ content, onVote }) => {
  const [user] = useContext(UserContext);
  const [voteCount, setVoteCount] = useState(content.voteTotal);
  const [userVote, setUserVote] = useState(content.userVote?.value ?? 0);
  const voteCb = useCallback(
    async (voteValue: number) => {
      if (!user) {
        route(URLS.pages.users.signIn);
        return;
      }
      voteValue = content.userVote?.value == voteValue ? 0 : voteValue;
      content.voteTotal += voteValue - (content.userVote?.value ?? 0);
      content.userVote = { value: voteValue };
      setUserVote(voteValue);
      setVoteCount(content.voteTotal);
      await onVote(voteValue);
    },
    [content]
  );
  return (
    <div className="inline-block">
      <div className="flex flex-col justify-center">
        <div
          className={classNames(
            "h-5 w-5 cursor-pointer",
            userVote == 1 ? "text-violet-400" : ""
          )}
          onClick={() => voteCb(1)}
        >
          <ArrowUpIcon />
        </div>
        <span className="text-center">{voteCount}</span>
        <div
          className={classNames(
            "h-5 w-5 cursor-pointer",
            userVote == -1 ? "text-violet-400" : ""
          )}
          onClick={() => voteCb(-1)}
        >
          <ArrowDownIcon />
        </div>
      </div>
    </div>
  );
};

export const PostVoteCounter = ({ post }: { post: Post }) => {
  const voteOnPostCb = useCallback(
    (voteValue: number) => {
      return voteForPost(post.id, voteValue);
    },
    [post]
  );
  return <VoteCounter content={post} onVote={voteOnPostCb} />;
};

export const CommentVoteCounter = ({
  postId,
  comment,
}: {
  postId: number;
  comment: Comment;
}) => {
  const voteOnCommentCb = useCallback(
    (voteValue: number) => {
      return voteForComment(postId, comment.id, voteValue);
    },
    [postId, comment]
  );
  return <VoteCounter content={comment} onVote={voteOnCommentCb} />;
};
