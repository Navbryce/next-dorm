import { User as FirebaseUser } from "@firebase/auth";
import { getCurrentLocalUser } from "src/actions/User";
import { LocalUser, User } from "src/types/types";
import { getAuth } from "firebase/auth";

export type UserMaybe = User | null | undefined;

export class AuthService {
  get authStateEstablished(): boolean {
    return this._user !== undefined;
  }

  // is undefined if the users state has not been established
  constructor(
    private readonly _user: UserMaybe,
    private setUser: (value: UserMaybe) => void
  ) {}

  public async setFirebaseUserAndUpdateProfile(
    firebaseUser: FirebaseUser | null
  ) {
    if (firebaseUser == null) {
      this.setUser(null);
      return;
    }

    // already logged in
    if (this._user && this._user.profile) {
      return;
    }

    const profile = await getCurrentLocalUser();
    await this.setUser({
      firebaseUser: AuthService.extractInfoFieldsFromFirebaseUser(firebaseUser),
      profile,
    });
  }

  public async setFirebaseUser(user: FirebaseUser): Promise<void> {
    await this.setUser({
      firebaseUser: AuthService.extractInfoFieldsFromFirebaseUser(user),
      profile: this._user?.profile ?? null,
    });
  }

  private static extractInfoFieldsFromFirebaseUser(user: FirebaseUser) {
    return {
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified,
    };
  }

  public async setProfile(profile: LocalUser | null): Promise<void> {
    if (!this._user) {
      throw new Error("can not update profile with no profile");
    }
    await this.setUser({
      firebaseUser: this._user?.firebaseUser,
      profile,
    });
  }

  public async refreshEmailVerifiedStatus() {
    if (!this._user) {
      throw new Error("user must be logged in");
    }
    await mustGetCurrentFirebaseUser(this._user).reload();
    const newFirebaseUser = mustGetCurrentFirebaseUser(this._user);
    // don't update if the value hasn't changed
    if (
      this._user.firebaseUser.emailVerified == newFirebaseUser.emailVerified
    ) {
      return newFirebaseUser.emailVerified;
    }
    await this.setUser({
      ...this._user,
      firebaseUser: {
        ...this._user.firebaseUser,
        emailVerified: newFirebaseUser.emailVerified,
      },
    });
    return newFirebaseUser.emailVerified;
  }
}

export function mustGetCurrentFirebaseUser(user: User): FirebaseUser {
  return getAuth().currentUser as FirebaseUser;
}
