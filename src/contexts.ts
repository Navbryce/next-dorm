import { createContext } from "preact";
import { AlertService } from "./utils/Alert";
import { LocalUser, User } from "src/types/types";
import { User as FirebaseUser } from "firebase/auth";
import { getCurrentLocalUser } from "src/actions/User";

type UserMaybe = User | null | undefined;

export const AlertContext = createContext(new AlertService());

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

    if (this._user && this._user.profile) {
      if (this._user.firebaseUser == firebaseUser) {
        return;
      }
      this.setUser({
        firebaseUser,
        profile: this._user?.profile,
      });
      return;
    }

    const profile = await getCurrentLocalUser();
    await this.setUser({
      firebaseUser,
      profile,
    });
  }

  public setProfile(profile: LocalUser | null) {
    if (!this._user) {
      throw new Error("can not update profile with no profile");
    }
    this.setUser({
      firebaseUser: this._user?.firebaseUser,
      profile,
    });
  }
}

export const UserContext = createContext<
  [UserMaybe,(value: UserMaybe) => void]
>([
  undefined,
  () => {
    // do nothing
  },
]);
