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
import { MainContent, Toolbar } from "src/components/StdLayout";

const Header: FunctionalComponent<Stylable> = ({ className }) => {
  const [user] = useContext(UserContext);

  return (
    <header
      className={classNames(
        "app-bg border-b border-secondary-100 flex justify-center p-5",
        className ?? ""
      )}
    >
      <Toolbar>
        <a href="/" className="no-underline dark:text-blue-100">
          <div className="flex items-center">
            <h1 className="text-3xl inline">NextDorm</h1>
          </div>
        </a>
      </Toolbar>
      <MainContent />
      <Toolbar>
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
      </Toolbar>
    </header>
  );
};

export default Header;
