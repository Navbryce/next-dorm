import { cloneElement, FunctionalComponent } from "preact";
import { Creator, KnownContentAuthor, Stylable } from "../types/types";
import { genLinkToUser } from "src/urls";
import { classNames } from "src/utils/styling";
import UploadedImage from "src/components/UploadedImage";

export const Avatar = ({
  user,
  className,
  ...rest
}: {
  user: Creator;
  width: number;
  height: number;
} & Stylable) => {
  let avatar;
  if (!user.avatar) {
    avatar = <img />;
  } else if ("blobName" in user.avatar) {
    avatar = <UploadedImage blobName={user.avatar.blobName} />;
  } else {
    avatar = <img src={user.avatar.url} />;
  }
  return cloneElement(avatar, {
    className: classNames("inline-block avatar", className ?? ""),
    ...rest,
  });
};

function WrapWithProfileLink(
  Component: FunctionalComponent<{ user: Creator }>
) {
  return ({ user }: { user: Creator }) => {
    if (!user || !("id" in user)) {
      return <Component user={user} />;
    }

    return (
      <a href={genLinkToUser(user as KnownContentAuthor)}>
        <Component user={user} />
      </a>
    );
  };
}

export const ProfileCard = WrapWithProfileLink(
  ({ user }: { user: Creator }) => {
    return (
      <div className="inline">
        <Avatar user={user} width={40} height={40} className="align-middle" />
        <span className="align-middle">{user.displayName}</span>
      </div>
    );
  }
);

export const ProfileCardSm = WrapWithProfileLink(
  ({ user }: { user: Creator }) => {
    return (
      <div className="inline">
        <Avatar className="align-middle" user={user} width={25} height={25} />
        <span className="align-middle">{user.displayName}</span>
      </div>
    );
  }
);
