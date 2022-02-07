import { FunctionalComponent, h } from "preact";
import firebase from "firebase/compat/app";
import { StyledFirebaseAuth } from "react-firebaseui";

export const AUTH_CONTAINER_ID = "firebaseui-auth-container";

export type SignInConfig = {
  redirectUrl?: string; // redirectUrl is relative to the app. where to redirect after signing in
};

function generateUiConfig({
  redirectUrl = "/",
}: SignInConfig): firebaseui.auth.Config {
  return {
    siteName: "NextDorm",
    signInFlow: "redirect",
    signInSuccessUrl: redirectUrl,
    signInOptions: [
      {
        provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
        signInMethod:
          firebase.auth.EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD,
      },
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    ],
  };
}

/**
 * Accepts a "redirect" query param for after signin
 */
const SignInScreen = () => {
  return (
    <div>
      <StyledFirebaseAuth
        uiConfig={generateUiConfig({})}
        firebaseAuth={firebase.auth()}
      />
    </div>
  );
};

export default SignInScreen;
