import { createContext } from "preact";
import { AlertService } from "./utils/Alert";
import { Profile, User } from "src/types/types";
import { User as FirebaseUser } from "firebase/auth";
import { getProfile } from "src/actions/User";

type UserMaybe = User | null | undefined;

export const AlertContext = createContext(new AlertService());

export class AuthService {
  get authStateEstablished(): boolean {
    return this._user !== undefined;
  }

  // is undefined if the user state has not been established
  constructor(
    private readonly _user: UserMaybe,
    private setUser: (value: UserMaybe) => void
  ) {}

  public async setFirebaseUserAndUpdateProfile(
    firebaseUser: FirebaseUser | null
  ) {
    if (firebaseUser == null) {
      await this.setUser(null);
      return;
    }

    // don't update if user is logged in and the logged-in user has a profile
    if (
      this._user &&
      firebaseUser == this._user.firebaseUser &&
      this._user?.profile
    ) {
      return;
    }

    const profile = await getProfile();
    await this.setUser({
      firebaseUser,
      profile,
    });
  }

  public setProfile(profile: Profile | null) {
    if (!this._user) {
      throw new Error("can not update profile with no profile");
    }
    this.setUser({
      firebaseUser: this._user?.firebaseUser,
      profile: profile,
    });
  }
}

export const UserContext = createContext<
  [UserMaybe, (value: UserMaybe) => void]
>([
  undefined,
  () => {
    // do nothing
  },
]);
