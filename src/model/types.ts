export type DisplayableUserRes =
  | {
      anonymousUser: AnonymousUserRes;
    }
  | { user: UserRes };

export type AnonymousUserRes = {
  avatar: string;
  displayName: string;
};

export type UserRes = {
  id: string;
  avatar: string;
  displayName: string;
};

export type Community = {
  id: number;
  name: string;
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

export type OnChangeProps<T> = {
  value: T;
  onChange: (value: T) => void;
};

export type StateProps<T> = T & {
  [Property in keyof T as `set${Capitalize<string & Property>}`]: (
    value: T[Property]
  ) => void;
};
