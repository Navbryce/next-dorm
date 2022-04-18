import firebase from "firebase/compat";
import { User as FirebaseUser } from "firebase/auth";

export type DisplayableUserRes =
  | {
      anonymousUser: AnonymousUserRes;
    }
  | { user: UserRes };

export type AnonymousUserRes = {
  avatar: string;
  displayName: string;
};

export interface DisplayableUser {
  displayName: string;
  avatar: string;
}

export type KnownDisplayableUser = DisplayableUser & {
  id: string;
};

export type LocalUser = {
  id: string;
  avatar: string;
  displayName: string;
};

export type User = {
  firebaseUser: FirebaseUser;
  profile: LocalUser | null;
};

export type UserRes = LocalUser;

export type Community = {
  id: number;
  name: string;
};

export type Subscription = {
  userId: string;
  communityId: string;
};

export type CommunityWithSubStatus = Community & {
  isSubscribed: boolean;
};

export enum Visibility {
  NORMAL = "NORMAL",
  HIDDEN = "HIDDEN",
}

export type ContentMetadataRes = {
  creator: DisplayableUserRes;
  voteTotal: number;
  userVote: { value: number } | null;
  imageBlobNames: string[];
  visibility: Visibility;
};

export type ContentMetadata = Omit<ContentMetadataRes, "creator"> & {
  creator: DisplayableUser;
};

export type PostRes = {
  id: number;
  title: string;
  content: string;
  communities: Community[];
} & ContentMetadataRes;

export type Post = {
  id: number;
  title: string;
  content: string;
  communities: Community[];
} & ContentMetadata;

export type CommentRes = {
  id: number;
  content: string;
  children: Comment[];
} & ContentMetadataRes;

export type Comment = {
  id: number;
  content: string;
  children: Comment[];
} & ContentMetadata;

export type PostCursor = any;

export type PostPageRes = {
  posts: PostRes[];
  nextCursor: PostCursor;
};

export type PostPage = {
  posts: Post[];
  nextCursor: PostCursor;
};

export type OnChangeProps<T> = {
  value: T;
  onChange: (value: T) => void;
};

export type StateProps<T> = T & {
  [Property in keyof T as `set${Capitalize<string & Property>}`]: (
    value: T[Property]
  ) => void;
};

export type Stylable = {
  className?: string;
};
