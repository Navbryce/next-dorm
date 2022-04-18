import { FunctionalComponent, h } from "preact";
import { useContext } from "preact/compat";
import { UserContext } from "src/contexts";
import DropdownMenu, { MenuItem } from "./DropdownMenu";
import { getAuth, signOut } from "firebase/auth";
import { route } from "preact-router";
import { genLinkToUser, URLS } from "src/urls";

const Header: FunctionalComponent = () => {
  const [user] = useContext(UserContext);

  return (
    <header class="shadow-lg bg:shadow-slate-900 p-5 flex justify-between">
      <a href="/" class="no-underline dark:text-blue-100">
        <h1 class="text-3xl flex flex-row items-center">NextDorm</h1>
      </a>
      {!user && (
        <button
          type="button"
          class="btn"
          onClick={() => route(URLS.pages.users.signIn)}
        >
          Sign in
        </button>
      )}
      {user && (
        <div>
          <DropdownMenu
            title={
              <div class="flex items-center">
                {user.profile && (
                  <img
                    class="inline"
                    src={user.profile.avatar}
                    width={25}
                    height={25}
                  />
                )}
                {user?.profile?.displayName ?? "No profile"}
              </div>
            }
          >
            {user.profile && (
              <MenuItem href={genLinkToUser(user.profile)}>
                View Profile
              </MenuItem>
            )}
            <MenuItem onClick={() => signOut(getAuth())}>Logout</MenuItem>
          </DropdownMenu>
        </div>
      )}
    </header>
  );
};

export default Header;
