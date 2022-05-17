import { FunctionalComponent } from "preact";
import {
  route,
  Route as PreactRoute,
  Router,
  RouterOnChangeArgs,
} from "preact-router";

import CommunityScreen from "src/routes/communities/[id]/index";
import NotFoundPage from "../routes/notfound";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "preact/compat";
import { UserContext } from "src/contexts";
import { AuthService } from "src/utils/auth";
import "src/utils/firebase";
import SignInScreen from "src/routes/users/sign-in";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import AllScreen from "src/routes/communities/AllScreen";
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
import { withStandardPageElements } from "src/components/StdLayout";
import VerifyScreen from "src/routes/users/verify";

const App: FunctionalComponent = () => {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  useLayoutEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);
  useEffect(() => {
    onAuthStateChanged(getAuth(), (firebaseUser) => {
      void new AuthService(user, setUser).setFirebaseUserAndUpdateProfile(
        firebaseUser
      );
    });
  }, []);

  const handleRouteChangeCb = useCallback(
    (e: RouterOnChangeArgs) => {
      if (user) {
        if (!user.firebaseUser.emailVerified) {
          if (e.url != URLS.pages.users.verify) {
            route(URLS.pages.users.verify);
          }
          return;
        }
        if (!user.profile) {
          if (e.url != URLS.pages.users.createProfile) {
            route(URLS.pages.users.createProfile);
          }
          return;
        }
      }
    },
    [user]
  );

  return (
    <UserContext.Provider value={[user, setUser]}>
      <div class="h-screen">
        <div class="dark:bg-gradient-to-r dark:bg-primary-900 dark:from-primary-800 h-screen overflow-y-auto flex flex-col justify-between">
          <div class="h-full">
            {new AuthService(user, setUser).authStateEstablished && (
              <Router onChange={handleRouteChangeCb}>
                <Route
                  path={URLS.pages.all}
                  requireSession={false}
                  requireProfile={false}
                  component={withStandardPageElements(AllScreen, {})}
                />
                <Route
                  path="/feed"
                  component={withStandardPageElements(FeedScreen, {})}
                />
                <Route
                  path="/communities/:communityId"
                  requireSession={false}
                  requireProfile={false}
                  component={withStandardPageElements(CommunityScreen, {})}
                />
                <PreactRoute
                  path="/communities/:communityId/add-post"
                  component={AddPostScreen}
                />
                <Route
                  path="/communities/:communityId/posts/:postId"
                  requireSession={false}
                  requireProfile={false}
                  component={withStandardPageElements(PostScreen, {})}
                />
                <Route
                  path="/communities/:communityId/posts/:postId/edit"
                  requireProfile={true}
                  component={withStandardPageElements(EditPostScreen, {})}
                />
                <Route
                  path={`${URLS.pages.users.root}/:userId`}
                  requireSession={false}
                  requireProfile={false}
                  component={withStandardPageElements(UserScreen, {})}
                />
                <PreactRoute
                  path={`${URLS.pages.users.root}/settings`}
                  component={SettingsScreen}
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
                <PreactRoute
                  path={URLS.pages.users.verify}
                  component={VerifyScreen}
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
