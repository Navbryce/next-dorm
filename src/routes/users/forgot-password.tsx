import { h } from "preact";
import { Label } from "src/components/inputs/Input";
import { useCallback, useContext, useState } from "preact/compat";
import {
  getAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { route } from "preact-router";
import { URLS } from "src/urls";
import { AuthService, UserContext } from "src/contexts";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { InboxIcon } from "@heroicons/react/solid";

const ForgotPasswordFormSchema = z.object({
  email: z.string().nonempty("Enter an email").email(),
});

type ForgotPasswordForm = z.infer<typeof ForgotPasswordFormSchema>;

const ForgotPasswordScreen = () => {
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(ForgotPasswordFormSchema),
    reValidateMode: "onSubmit",
  });

  const onSignInCb = useCallback(
    ({ email }: ForgotPasswordForm) => {
      const auth = getAuth();
      sendPasswordResetEmail(auth, email)
        .then(async () => {
          setEmailSent(true);
        })
        .catch(({ code }) => {
          throw new Error(code);
        });
    },
    [setError]
  );

  return (
    <div class="fixed w-full h-full flex justify-center items-center">
      {emailSent ? (
        <div className="rounded bg-slate-900 p-6 m-6 w-full max-w-xs shadow-lg h-fit space-y-4">
          <div className="inline-middle">
            <InboxIcon
              width="30"
              height="30"
              className="inline-block align-middle"
            />
            Reset email sent!
          </div>
          <div>
            <a href={URLS.pages.users.signIn} className="link">
              Login
            </a>
          </div>
        </div>
      ) : (
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
          <div class="py-2 space-x-2 space-y-2">
            <button type="submit">Reset</button>
            <div>
              <a href={URLS.pages.users.register} className="link">
                Don't have an account?
              </a>
            </div>
            <div>
              <a href={URLS.pages.users.signIn} className="link">
                Login
              </a>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default ForgotPasswordScreen;
