import { AnyComponent, FunctionalComponent, h } from "preact";
import { RouteProps, Router } from "preact-router";

import CommunityScreen from "../routes/communities";
import NotFoundPage from "../routes/notfound";
import Header from "./Header";
import { useCallback, useContext, useEffect, useState } from "preact/compat";
import { AlertContext, UserContext, AuthService } from "../contexts";
import Footer from "./Footer";
import "../utils/firebase";
import SignInScreen from "src/routes/user/sign-in";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import AllScreen from "../routes/communities/AllScreen";
import CommunitiesList from "./CommunitiesList";
import FeedScreen from "../routes/FeedScreen";
import RegisterScreen from "src/routes/user/register";
import CreateProfileScreen from "src/routes/user/create-profile";
import { URLS } from "src/urls";
import { Profile, User } from "src/types/types";
import { getProfile } from "src/actions/User";
import Route from "src/components/Route";

// TODO: Absolute imports
function withStandardPageElements<T>(
  component: RouteProps<T>["component"]
): FunctionalComponent<T> {
  return ({ ...rest }) => {
    return (
      <div class="w-full h-full">
        <Header />
        <div class="h-[calc(100%-120px)] flex">
          <div className="w-64">
            <CommunitiesList />
          </div>
          {h(component, rest)}
        </div>
      </div>
    );
  };
}

const App: FunctionalComponent = () => {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  useEffect(() => {
    onAuthStateChanged(getAuth(), (firebaseUser) => {
      void new AuthService(user, setUser).setFirebaseUserAndUpdateProfile(
        firebaseUser
      );
    });
  }, []);

  return (
    <UserContext.Provider value={[user, setUser]}>
      <div class="dark h-screen">
        <div class="dark:bg-gradient-to-r dark:bg-primary-900 dark:from-primary-800 dark:text-blue-100 h-screen overflow-y-scroll flex flex-col justify-between">
          <div class="h-full">
            {new AuthService(user, setUser).authStateEstablished && (
              <div class="h-[calc(100%-120px)] flex">
                <Router>
                  <Route
                    path="/"
                    component={withStandardPageElements(FeedScreen)}
                  />
                  <Route
                    path="/communities/all"
                    requireSession={false}
                    component={withStandardPageElements(AllScreen)}
                  />
                  <Route
                    path="/communities/:communityId"
                    requireSession={false}
                    component={withStandardPageElements(CommunityScreen)}
                  />
                  <Route
                    path={URLS.pages.user.signIn}
                    requireSession={false}
                    requireProfile={false}
                    component={SignInScreen}
                  />
                  <Route
                    requireSession={false}
                    requireProfile={false}
                    path={URLS.pages.user.register}
                    component={RegisterScreen}
                  />
                  <Route
                    requireSession={true}
                    requireProfile={false}
                    path={URLS.pages.user.createProfile}
                    component={CreateProfileScreen}
                  />
                  <NotFoundPage default />
                </Router>
              </div>
            )}
          </div>
          <Footer />
        </div>
      </div>
    </UserContext.Provider>
  );
};

export default App;
