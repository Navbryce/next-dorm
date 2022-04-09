import { FunctionalComponent, h } from "preact";
import { useContext } from "preact/compat";
import { UserContext } from "../contexts";
import DropdownMenu, { MenuItem } from "./DropdownMenu";
import { getAuth, signOut } from "firebase/auth";
import { route } from "preact-router";
import { URLS } from "src/urls";

const Header: FunctionalComponent = () => {
  const [user] = useContext(UserContext);

  return (
    <header class="shadow-lg bg:shadow-slate-900 p-5 flex justify-between">
      <a href="/" class="no-underline dark:text-blue-100">
        <h1 class="text-3xl flex flex-row items-center">NextDorm</h1>
      </a>
      {!user && (
        <button onClick={() => route(URLS.pages.user.signIn)}>Sign in</button>
      )}
      {user && (
        <div>
          <DropdownMenu title={user?.profile?.displayName ?? "No profile"}>
            <MenuItem href="/">View Profile</MenuItem>
            <MenuItem onClick={() => signOut(getAuth())}>Logout</MenuItem>
          </DropdownMenu>
        </div>
      )}
    </header>
  );
};

export default Header;
