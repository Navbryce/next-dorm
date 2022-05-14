import { useCallback, useContext } from "preact/compat";
import { UserContext } from "src/contexts";
import { AuthService } from "src/utils/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod/dist/zod";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Label } from "src/components/inputs/Input";
import { URLS } from "src/urls";
import { z } from "zod";
import { Stylable } from "src/types/types";

const SignInSchema = z.object({
  email: z.string().nonempty("Enter an email").email(),
  password: z.string().nonempty("Enter a password"),
});

type SignInUser = z.infer<typeof SignInSchema>;

type Props = {
  includeRegister?: boolean;
  includeForgotPassword?: boolean;
  onSignIn: () => void;
} & Stylable;

const AuthenticatePrompt = ({
  includeRegister,
  includeForgotPassword,
  onSignIn,
  className,
}: Props) => {
  const [user, setUser] = useContext(UserContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SignInUser>({
    resolver: zodResolver(SignInSchema),
    reValidateMode: "onSubmit",
    defaultValues: {
      email: user?.firebaseUser.email ?? undefined,
    },
  });

  const onSignInCb = useCallback(
    ({ email, password }: SignInUser) => {
      const auth = getAuth();
      signInWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
          await new AuthService(user, setUser).setFirebaseUserAndUpdateProfile(
            userCredential.user
          );
          onSignIn();
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
        });
    },
    [setError]
  );

  return (
    <form className={className} onSubmit={handleSubmit(onSignInCb) as any}>
      <div>
        <Label htmlFor="email" className="block">
          Email
        </Label>
        <input
          className={errors.email ? "border border-red-500" : ""}
          {...register("email")}
          {...(user?.firebaseUser.email ? { readonly: true } : {})}
        />
        {errors.email && <div class="text-red-500">{errors.email.message}</div>}
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
      <div class="space-x-2 space-y-2">
        <button type="submit">Sign In</button>
        {includeRegister && (
          <div>
            <a href={URLS.pages.users.register} className="link">
              Don't have an account?
            </a>
          </div>
        )}
        {includeForgotPassword && (
          <div>
            <a href={URLS.pages.users.forgotPassword} className="link">
              Forgot password?
            </a>
          </div>
        )}
      </div>
    </form>
  );
};

export default AuthenticatePrompt;
