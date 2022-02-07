import {FunctionalComponent, h} from "preact";
import {signIn} from "../actions/User";
import {useCallback, useContext} from "preact/compat";
import {UserContext} from "../contexts";
import DropdownMenu, {MenuItem} from "./DropdownMenu";
import {getAuth, signOut} from "firebase/auth";

const Header: FunctionalComponent = () => {
  const user = useContext(UserContext);
  const signInCb = useCallback(() => {
    signIn({redirectUrl: "test"});
  }, []);
  return (
    <header class="shadow-lg bg:shadow-slate-900 p-5 flex justify-between">
      <a href="/" class="no-underline dark:text-blue-100">
        <h1 class="text-3xl flex flex-row items-center">
          NextDorm
        </h1>
      </a>
      {!user && <button onClick={signInCb}>Sign in</button>}
      {user &&
          <div>
              <DropdownMenu title={user.displayName ?? "User"}>
                  <MenuItem href="/">View Profile</MenuItem>
                  <MenuItem onClick={() => signOut(getAuth())}>Logout</MenuItem>
              </DropdownMenu>
          </div>
      }
    </header>
  );
};

export default Header;
