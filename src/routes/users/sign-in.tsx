import { h } from "preact";
import { Label } from "src/components/inputs/Input";
import { useCallback, useContext, useState } from "preact/compat";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { route } from "preact-router";
import { URLS } from "src/urls";
import { AuthService, UserContext } from "src/contexts";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const SignInSchema = z.object({
  email: z.string().nonempty("Enter an email").email(),
  password: z.string().nonempty("Enter a password"),
});

type SignInUser = z.infer<typeof SignInSchema>;

const SignInScreen = () => {
  const [user, setUser] = useContext(UserContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SignInUser>({
    resolver: zodResolver(SignInSchema),
    reValidateMode: "onSubmit",
  });

  const onSignInCb = useCallback(
    ({ email, password }: SignInUser) => {
      const auth = getAuth();
      signInWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
          await new AuthService(user, setUser).setFirebaseUserAndUpdateProfile(
            userCredential.user
          );
          route("/");
        })
        .catch(({ message, code }) => {
          switch (code) {
            case "auth/user-not-found":
              setError("email", { type: "custom", message: "User not found" });
              break;
            case "auth/wrong-password":
              setError("password", {
                type: "custom",
                message: "Wrong password",
              });
              break;
            default:
              throw new Error(message);
          }
          // TODO: Catch login errors
        });
    },
    [setError]
  );

  return (
    <div class="fixed w-full h-full flex justify-center items-center">
      <form onSubmit={handleSubmit(onSignInCb) as any}>
        <div>
          <Label htmlFor="email" className="block">
            Email
          </Label>
          <input
            className={errors.email ? "border border-red-500" : ""}
            {...register("email")}
          />
          {errors.email && (
            <div class="text-red-500">{errors.email.message}</div>
          )}
        </div>
        <div>
          <Label htmlFor="password" className="block">
            Password
          </Label>
          <input
            type="password"
            className={errors.password ? "border border-red-500" : ""}
            {...register("password")}
          />
          {errors.password && (
            <div class="text-red-500">{errors.password.message}</div>
          )}
        </div>
        <div class="py-2 space-x-2 space-y-2">
          <button type="submit">Sign In</button>
          <div>
            <a href={URLS.pages.users.register} className="link">
              Don't have an account?
            </a>
          </div>
          <div>
            <a href={URLS.pages.users.forgotPassword} className="link">
              Forgot password?
            </a>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignInScreen;
