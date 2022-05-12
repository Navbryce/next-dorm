import { FunctionalComponent, h } from "preact";
import { RouteProps, Router } from "preact-router";

import CommunityScreen from "src/routes/communities/[id]/index";
import NotFoundPage from "../routes/notfound";
import Header from "./Header";
import { useEffect, useLayoutEffect, useState } from "preact/compat";
import { AuthService, UserContext } from "src/contexts";
import "src/utils/firebase";
import SignInScreen from "src/routes/users/sign-in";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import AllScreen from "src/routes/communities/AllScreen";
import CommunitiesList from "src/components/CommunitiesList";
import FeedScreen from "src/routes/FeedScreen";
import RegisterScreen from "src/routes/users/register";
import CreateProfileScreen from "src/routes/users/create-profile";
import { URLS } from "src/urls";
import { User } from "src/types/types";
import Route from "src/components/Route";
import AddPostScreen from "src/routes/communities/[id]/add-post";
import PostScreen from "src/routes/communities/[id]/posts/index";
import UserScreen from "src/routes/users/[id]/index";
import ForgotPasswordScreen from "src/routes/users/forgot-password";
import EditPostScreen from "src/routes/communities/[id]/posts/edit";
import SettingsScreen from "src/routes/users/[id]/settings";

// TODO: Absolute imports
function withStandardPageElements<T>(
  component: RouteProps<T>["component"],
  { noCommunitiesList }: { noCommunitiesList?: boolean }
): FunctionalComponent<T> {
  return ({ ...rest }) => {
    return (
      <div class="w-full h-full">
        <Header />
        <div class="h-[calc(100%-120px) w-full] flex justify-center">
          {h(component, rest)}
        </div>
      </div>
    );
  };
}

const App: FunctionalComponent = () => {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  useLayoutEffect(() => {
    document.documentElement.classList.add("dark");
  });
  useEffect(() => {
    onAuthStateChanged(getAuth(), (firebaseUser) => {
      void new AuthService(user, setUser).setFirebaseUserAndUpdateProfile(
        firebaseUser
      );
    });
  }, []);

  return (
    <UserContext.Provider value={[user, setUser]}>
      <div class="h-screen">
        <div class="dark:bg-gradient-to-r dark:bg-primary-900 dark:from-primary-800 h-screen overflow-y-auto flex flex-col justify-between">
          <div class="h-full">
            {new AuthService(user, setUser).authStateEstablished && (
              <Router>
                <Route
                  path="/"
                  component={withStandardPageElements(FeedScreen, {})}
                />
                <Route
                  path="/communities/all"
                  requireSession={false}
                  component={withStandardPageElements(AllScreen, {})}
                />
                <Route
                  path="/communities/:communityId"
                  requireSession={false}
                  component={withStandardPageElements(CommunityScreen, {})}
                />
                <Route
                  path="/communities/:communityId/add-post"
                  requireSession={false}
                  component={withStandardPageElements(AddPostScreen, {
                    noCommunitiesList: true,
                  })}
                />
                <Route
                  path="/communities/:communityId/posts/:postId"
                  requireSession={false}
                  component={withStandardPageElements(PostScreen, {
                    noCommunitiesList: true,
                  })}
                />
                <Route
                  path="/communities/:communityId/posts/:postId/edit"
                  requireProfile={true}
                  component={withStandardPageElements(EditPostScreen, {
                    noCommunitiesList: true,
                  })}
                />
                <Route
                  path={`${URLS.pages.users.root}/:userId`}
                  requireSession={false}
                  component={withStandardPageElements(UserScreen, {
                    noCommunitiesList: true,
                  })}
                />
                <Route
                  path={`${URLS.pages.users.root}/settings`}
                  requireSession={false}
                  component={withStandardPageElements(SettingsScreen, {})}
                />
                <Route
                  path={URLS.pages.users.signIn}
                  requireSession={false}
                  requireProfile={false}
                  component={SignInScreen}
                />
                <Route
                  requireSession={false}
                  requireProfile={false}
                  path={URLS.pages.users.register}
                  component={RegisterScreen}
                />
                <Route
                  requireSession={false}
                  requireProfile={false}
                  path={URLS.pages.users.forgotPassword}
                  component={ForgotPasswordScreen}
                />
                <Route
                  requireSession={true}
                  requireProfile={false}
                  path={URLS.pages.users.createProfile}
                  component={CreateProfileScreen}
                />
                <NotFoundPage default />
              </Router>
            )}
          </div>
        </div>
      </div>
    </UserContext.Provider>
  );
};

export default App;
