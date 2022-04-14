import { FunctionalComponent, h } from "preact";
import { DisplayableUser, DisplayableUserRes } from "../types/types";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { toDisplayableUser } from "src/utils/auth";

export const Avatar = ({
  user,
  ...rest
}: {
  user: DisplayableUser;
  width: number;
  height: number;
}) => {
  return (
    <div class="inline-block">
      <LazyLoadImage src={user.avatar} {...rest} />
    </div>
  );
};

export const PostProfileCard = ({ user }: { user: DisplayableUser }) => {
  return (
    <div class="flex items-center">
      <Avatar user={user} width={40} height={40} />
      <span>{user.displayName}</span>
    </div>
  );
};

export const CommentProfileCard = ({ user }: { user: DisplayableUser }) => {
  return (
    <div class="flex items-center">
      <Avatar user={user} width={25} height={25} />
      <span>{user.displayName}</span>
    </div>
  );
};
