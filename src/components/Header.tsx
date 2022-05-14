import { Fragment, FunctionalComponent, h } from "preact";
import { useContext } from "preact/compat";
import { UserContext } from "src/contexts";
import DropdownMenu, { MenuItem } from "./DropdownMenu";
import { getAuth, signOut } from "firebase/auth";
import { route } from "preact-router";
import { genLinkToUser, URLS } from "src/urls";
import { getPublicUrlForImage } from "src/utils/upload";
import { Stylable } from "src/types/types";
import { classNames } from "src/utils/styling";

const Header: FunctionalComponent<Stylable> = ({ className }) => {
  const [user] = useContext(UserContext);

  return (
    <header
      className={classNames(
        "shadow-lg bg:shadow-slate-900 p-5 flex justify-between",
        className ?? ""
      )}
    >
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
                    width={25}
                    height={25}
                    src={getPublicUrlForImage(user.profile.avatarBlobName)}
                  />
                )}
                {user?.profile?.displayName ?? "No profile"}
              </div>
            }
          >
            {user.profile && (
              <Fragment>
                <MenuItem href={genLinkToUser(user.profile)}>
                  View Profile
                </MenuItem>
                <MenuItem href={`${URLS.pages.users.settings}`}>
                  Settings
                </MenuItem>
              </Fragment>
            )}
            <MenuItem onClick={() => signOut(getAuth())}>Logout</MenuItem>
          </DropdownMenu>
        </div>
      )}
    </header>
  );
};

export default Header;
