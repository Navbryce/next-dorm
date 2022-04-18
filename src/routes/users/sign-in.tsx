import { h } from "preact";
import { Input, Label } from "src/components/inputs/Input";
import { useCallback, useContext, useState } from "preact/compat";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { route } from "preact-router";
import { URLS } from "src/urls";
import { AuthService, UserContext } from "src/contexts";

const SignInScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useContext(UserContext);

  const onSignInCb = useCallback(
    (e: Event) => {
      e.preventDefault();
      const auth = getAuth();
      signInWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
          await new AuthService(user, setUser).setFirebaseUserAndUpdateProfile(
            userCredential.user
          );
          route("/");
        })
        .catch(({ message, code }) => {
          // TODO: Catch login errors
        });
    },
    [email, password]
  );
  return (
    <div class="fixed w-full h-full flex justify-center items-center">
      <form onSubmit={onSignInCb}>
        <div>
          <Label htmlFor="email" className="block">
            Email
          </Label>
          <Input
            name="email"
            value={email}
            onChange={(e) => setEmail((e.target as HTMLInputElement).value)}
          />
        </div>
        <div>
          <Label htmlFor="password" className="block">
            Password
          </Label>
          <Input
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword((e.target as HTMLInputElement).value)}
          />
        </div>
        <div class="py-2 space-x-2">
          <button type="submit">Sign In</button>
          <button
            type="button"
            class="btn"
            onClick={() => route(URLS.pages.users.register)}
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignInScreen;
