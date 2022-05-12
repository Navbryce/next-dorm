import { h } from "preact";
import { Label } from "src/components/inputs/Input";
import { useCallback, useState } from "preact/compat";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { route } from "preact-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod/dist/zod";
import { z } from "zod";
import { URLS } from "src/urls";

const RegisterUserSchema = z
  .object({
    email: z.string().nonempty("Enter an email").email(),
    password: z.string().nonempty("Enter a password"),
    confirmPassword: z.string().nonempty("Confirm password"),
  })
  .refine(({ password, confirmPassword }) => password == confirmPassword, {
    message: "Passwords not match",
    path: ["password"],
  });

type RegisterUser = z.infer<typeof RegisterUserSchema>;

const RegisterScreen = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterUser>({
    resolver: zodResolver(RegisterUserSchema),
    reValidateMode: "onSubmit",
  });

  const onRegisterCb = useCallback(
    ({ email, password }: RegisterUser) => {
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          route("/");
        })
        .catch(({ message, code }) => {
          switch (code) {
            case "auth/email-already-in-use":
              setError("email", {
                type: "custom",
                message: "Email already in use",
              });
              break;
            case "auth/weak-password":
              setError("password", {
                type: "custom",
                message: "Needs stronger password",
              });
              break;
            default:
              throw new Error(code);
          }
        });
    },
    [setError]
  );
  return (
    <div class="w-full h-full flex justify-center items-center">
      <form className="form" onSubmit={handleSubmit(onRegisterCb) as any}>
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
        <div>
          <Label htmlFor="confirmPassword" className="block">
            Confirm Password
          </Label>
          <input
            type="password"
            className={errors.confirmPassword ? "border border-red-500" : ""}
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <div class="text-red-500">{errors.confirmPassword.message}</div>
          )}
        </div>
        <div class="py-2">
          <button type="submit">Register</button>
          <div>
            <a href={URLS.pages.users.signIn} className="link">
              Already have an account? Login
            </a>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RegisterScreen;
