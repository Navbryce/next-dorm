import { route } from "preact-router";
import AuthenticatePrompt from "src/components/AuthenticatePrompt";

const SignInScreen = () => {
  return (
    <div class="fixed w-full h-full flex justify-center items-center">
      <AuthenticatePrompt
        className="form"
        onSignIn={() => route("/")}
        includeForgotPassword
        includeRegister
      />
    </div>
  );
};

export default SignInScreen;
