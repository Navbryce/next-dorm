import { FunctionalComponent, h } from "preact";
import { DisplayableUserRes } from "../types/types";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { toDisplayableUser, DisplayableUser } from "src/model/DisplayableUser";

const Avatar = ({
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

export const PostProfileCard = ({ user }: { user: DisplayableUserRes }) => {
  return (
    <div class="flex items-center">
      <Avatar user={toDisplayableUser(user)} width={40} height={40} />
      <span>{toDisplayableUser(user).displayName}</span>
    </div>
  );
};

export const CommentProfileCard = ({ user }: { user: DisplayableUserRes }) => {
  return (
    <div class="flex items-center">
      <Avatar user={toDisplayableUser(user)} width={25} height={25} />
      <span>{toDisplayableUser(user).displayName}</span>
    </div>
  );
};
