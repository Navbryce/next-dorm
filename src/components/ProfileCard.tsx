import { FunctionalComponent, h } from "preact";
import {
  DisplayableUser,
  DisplayableUserRes,
  KnownDisplayableUser,
} from "../types/types";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { toDisplayableUser } from "src/utils/user";
import { genLinkToUser } from "src/urls";

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

function WrapWithProfileLink(
  Component: FunctionalComponent<{ user: DisplayableUser }>
) {
  return ({ user }: { user: DisplayableUser }) => {
    if (!("id" in user)) {
      return <Component user={user} />;
    }

    return (
      <a href={genLinkToUser(user as KnownDisplayableUser)}>
        <Component user={user} />
      </a>
    );
  };
}

export const ProfileCard = WrapWithProfileLink(
  ({ user }: { user: DisplayableUser }) => {
    return (
      <div class="flex items-center">
        <Avatar user={user} width={40} height={40} />
        <span>{user.displayName}</span>
      </div>
    );
  }
);

export const ProfileCardSm = WrapWithProfileLink(
  ({ user }: { user: DisplayableUser }) => {
    return (
      <div class="flex items-center">
        <Avatar user={user} width={25} height={25} />
        <span>{user.displayName}</span>
      </div>
    );
  }
);
