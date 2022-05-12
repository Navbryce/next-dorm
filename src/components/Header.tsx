import { Fragment, FunctionalComponent, h } from "preact";
import { useContext } from "preact/compat";
import { UserContext } from "src/contexts";
import DropdownMenu, { MenuItem } from "./DropdownMenu";
import { getAuth, signOut } from "firebase/auth";
import { route } from "preact-router";
import { genLinkToUser, URLS } from "src/urls";
import UploadedImage from "src/components/UploadedImage";

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
                  <UploadedImage
                    className="inline"
                    blobName={user.profile.avatarBlobName}
                    width={25}
                    height={25}
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
