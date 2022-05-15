import { Dayjs } from "dayjs";

export type ContentAuthorRes =
  | {
      anonymousUser: Alias;
    }
  | { user: UserRes; anonymousUser?: Alias };

export type Alias = {
  avatarUrl: string;
  displayName: string;
};

export interface Creator {
  displayName: string;
  avatar: { blobName: string } | { url: string } | null | undefined;
}

export type KnownContentAuthor = Creator & {
  id: string;
};

export type LocalUser = {
  id: string;
  avatarBlobName: string;
  displayName: string;
};

export type User = {
  firebaseUser: { uid: string; email: string | null; emailVerified: boolean };
  profile: LocalUser | null;
};

export type UserRes = LocalUser;

export type Community = {
  id: number;
  name: string;
};

export type CommunityPosInTree = {
  path: Community[];
  children: Community[];
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

export enum Status {
  POSTED = "POSTED",
  DELETED = "DELETED",
}

export type ContentMetadataRes = {
  creator: ContentAuthorRes;
  voteTotal: number;
  userVote: { value: number } | null;
  imageBlobNames: string[];
  visibility: Visibility;
  status: Status;
  createdAt: number;
  updatedAt: number;
};

export type ContentMetadata = Omit<
  ContentMetadataRes,
  "creator" | "createdAt" | "updatedAt"
> & {
  creator: Creator;
  updatedAt: Dayjs;
  createdAt: Dayjs;
};

export type PostRes = {
  id: number;
  title: string;
  content: string;
  communities: Community[];
  commentCount: number;
} & ContentMetadataRes;

export type Post = {
  id: number;
  title: string;
  content: string;
  communities: Community[];
  commentCount: number;
} & ContentMetadata;

export type CommentRes = {
  id: number;
  content: string;
  children: CommentRes[];
} & ContentMetadataRes;

export type Comment = {
  id: number;
  content: string;
  children: Comment[];
} & ContentMetadata;

export enum CursorType {
  MOST_RECENT = "MOST_RECENT",
  SUBBED_MOST_RECENT = "SUBBED_MOST_RECENT",
  MOST_POPULAR = "MOST_POPULAR",
  SUBBED_MOST_POPULAR = "SUBBED_MOST_POPULAR",
}

export enum Since {
  TODAY = "TODAY",
}

export type PostCursor = unknown;

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
