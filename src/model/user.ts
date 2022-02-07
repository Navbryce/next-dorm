import { AnonymousUserRes, DisplayableUserRes, UserRes } from "./types";

export class AnonymousUser implements DisplayableUser {
  get displayName(): string {
    return this.anonymousUser.displayName;
  }

  get avatar(): string {
    return this.anonymousUser.avatar;
  }
  constructor(private anonymousUser: AnonymousUserRes) {}
}

export class User implements DisplayableUser {
  get displayName(): string {
    return this.user.displayName;
  }

  get avatar(): string {
    return this.user.avatar;
  }
  constructor(private user: UserRes) {}
}

export function toDisplayableUser(user: DisplayableUserRes): DisplayableUser {
  return "user" in user
    ? new User(user.user)
    : new AnonymousUser(user.anonymousUser);
}

export interface DisplayableUser {
  displayName: string;
  avatar: string;
}
