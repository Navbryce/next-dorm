import { FunctionalComponent, h } from "preact";
import { useCallback, useContext, useState } from "preact/compat";
import { route } from "preact-router";
import { Label } from "src/components/inputs/Input";
import { createProfile } from "src/actions/User";
import { AuthService, UserContext } from "src/contexts";

const CreateProfileScreen = () => {
  const [user, setUser] = useContext(UserContext);
  const [displayName, setDisplayName] = useState("");
  const onCreateProfile = useCallback(async () => {
    await new AuthService(user, setUser).setProfile(
      await createProfile({ displayName })
    );
    route("/");
  }, [user, setUser, displayName]);
  return (
    <div class="h-full w-full flex items-center justify-center">
      <div class="form max-w-md space-y-4">
        <div>
          <h3>
            Please enter your username. This will be used as your display name
            and cannot be changed.
          </h3>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <div>
              <Label htmlFor="username" className="block">
                Username
              </Label>
              <input
                name="username"
                value={displayName}
                onChange={(e) =>
                  setDisplayName((e.target as HTMLInputElement).value)
                }
              />
            </div>
            <div class="py-2">
              <button onClick={onCreateProfile}>Save</button>
            </div>
          </div>
          <div>
            <img width="100" height="100" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProfileScreen;
