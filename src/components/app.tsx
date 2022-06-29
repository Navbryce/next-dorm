import { FunctionalComponent } from "preact";
import {
  route,
  Route as PreactRoute,
  Router,
  RouterOnChangeArgs,
} from "preact-router";

import CommunityScreen from "src/routes/comm/[id]/index";
import NotFoundPage from "../routes/notfound";
import {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "preact/compat";
import {
  AlertContext,
  ReferringScreenContext,
  UserContext,
} from "src/contexts";
import { AuthService } from "src/utils/auth";
import "src/utils/firebase";
import SignInScreen from "src/routes/users/sign-in";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import AllScreen from "src/routes/comm/AllScreen";
import FeedScreen from "src/routes/FeedScreen";
import RegisterScreen from "src/routes/users/register";
import CreateProfileScreen from "src/routes/users/create-profile";
import { URLS } from "src/urls";
import { User } from "src/types/types";
import Route from "src/components/Route";
import AddPostScreen from "src/routes/comm/[id]/add-post";
import PostScreen from "src/routes/comm/[id]/posts/index";
import UserScreen from "src/routes/users/[id]/index";
import ForgotPasswordScreen from "src/routes/users/forgot-password";
import EditPostScreen from "src/routes/comm/[id]/posts/edit";
import SettingsScreen from "src/routes/users/[id]/settings";
import { withStandardPageElements } from "src/components/StdLayout";
import VerifyScreen from "src/routes/users/verify";
import { AlertService } from "src/utils/Alert";
import AboutScreen from "src/routes/Landing";
import ReportCommentScreen from "src/routes/comm/[id]/posts/comments/[id]/report";
import ReportPostScreen from "src/routes/comm/[id]/posts/report";

// Register error lsiteners
function registerErrorListeners(alertService: AlertService) {
  window.addEventListener("error", (error) =>
    alertService.alert({ title: "Error", text: error.message })
  );
  window.addEventListener("unhandledrejection", (error) =>
    alertService.alert({ title: "Error", text: error.reason })
  );
}

const App: FunctionalComponent = () => {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [referringScreenURL, setReferringScreenURL] = useState<string>();
  const alertService = useContext(AlertContext);

  useLayoutEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);
  useLayoutEffect(() => {
    registerErrorListeners(alertService);
  }, [alertService]);

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
      <ReferringScreenContext.Provider
        value={[referringScreenURL, setReferringScreenURL]}
      >
        <div className="h-screen">
          <div className="app-bg text-gray-100 h-screen overflow-y-auto flex flex-col justify-between">
            <div className="h-full">
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
                    path="/comm/:communityId"
                    requireSession={false}
                    requireProfile={false}
                    component={withStandardPageElements(CommunityScreen, {})}
                  />
                  <PreactRoute
                    path="/comm/:communityId/add-post"
                    component={AddPostScreen}
                  />
                  <Route
                    path="/comm/:communityId/posts/:postId"
                    requireSession={false}
                    requireProfile={false}
                    component={withStandardPageElements(PostScreen, {})}
                  />
                  <Route
                    path="/comm/:communityId/posts/:postId/edit"
                    requireProfile={true}
                    component={withStandardPageElements(EditPostScreen, {})}
                  />
                  <PreactRoute
                    path="/comm/:communityId/posts/:postId/report"
                    component={ReportPostScreen}
                  />
                  <PreactRoute
                    path="/comm/:communityId/posts/:postId/comments/:commentId/report"
                    component={ReportCommentScreen}
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
                  <PreactRoute
                    path={URLS.pages.about}
                    component={AboutScreen}
                  />
                  <NotFoundPage default />
                </Router>
              )}
            </div>
          </div>
        </div>
      </ReferringScreenContext.Provider>
    </UserContext.Provider>
  );
};

export default App;
