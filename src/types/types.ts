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

export type Profile = {
  id: string;
  avatar: string;
  displayName: string;
};

export type User = {
  firebaseUser: FirebaseUser;
  profile: Profile | null;
};

export type UserRes = Profile;

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

export type ContentMetadata = {
  creator: DisplayableUserRes;
  voteTotal: number;
  userVote: { value: number } | null;
  visibility: Visibility;
};

export type Post = {
  id: number;
  title: string;
  content: string;
  communities: Community[];
} & ContentMetadata;

export type Comment = {
  id: number;
  content: string;
  children: Comment[];
} & ContentMetadata;

export type PostCursor = any;

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
