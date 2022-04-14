import { FunctionalComponent, h } from "preact";
import firebase from "firebase/compat/app";
import { Input, Label } from "src/components/inputs/Input";
import { useCallback, useState } from "preact/compat";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { route } from "preact-router";

/**
 * Accepts a "redirect" query param for after sign-in
 */
const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const onRegisterCb = useCallback(() => {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        route("/");
      })
      .catch(({ message, code }) => {
        // TODO: Catch login errors
      });
  }, [email, password, confirmPassword]);
  return (
    <div class="w-full h-full flex justify-center items-center">
      <div class="form">
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
        <div>
          <Label htmlFor="confirm-password" className="block">
            Confirm Password
          </Label>
          <Input
            name="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword((e.target as HTMLInputElement).value)
            }
          />
        </div>
        <div class="py-2">
          <button onClick={onRegisterCb}>Register</button>
        </div>
      </div>
    </div>
  );
};

export default RegisterScreen;
