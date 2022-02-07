import { FunctionalComponent, h } from "preact";
import { Route, Router } from "preact-router";

import CommunityScreen from "../routes/Community";
import NotFoundPage from "../routes/notfound";
import Header from "./Header";
import { useContext, useState } from "preact/compat";
import { AlertContext, UserContext } from "../contexts";
import Footer from "./Footer";
import "../utils/firebase";
import SignInScreen from "../routes/signin";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import Spinner from "./Spinner";
import AllScreen from "../routes/AllScreen";
import CommunitiesList from "./CommunitiesList";

// TODO: Absolute imports

const App: FunctionalComponent = () => {
  const [user, setUser] = useState<User | undefined | null>(undefined);
  const alertService = useContext(AlertContext);
  onAuthStateChanged(getAuth(), (user) => {
    setUser(user);
  });

  return (
    <UserContext.Provider value={user}>
      <div class="dark h-screen">
        <div class="dark:bg-gradient-to-r dark:bg-primary-900 dark:from-primary-800 dark:text-blue-100 h-screen overflow-y-scroll flex flex-col justify-between">
          <div class="h-full">
            <Header />
            {user !== undefined && (
              <div class="h-[calc(100%-120px)] flex">
                <div class="w-64">
                  <CommunitiesList />
                </div>
                <Router>
                  <Route path="/communities/all" component={AllScreen} />
                  <Route
                    path="/communities/:communityId"
                    component={CommunityScreen}
                  />
                  <Route path="/sign-in" component={SignInScreen} />
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
