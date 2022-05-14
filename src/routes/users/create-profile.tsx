import { useCallback, useContext, useEffect, useState } from "preact/compat";
import { route } from "preact-router";
import { Label } from "src/components/inputs/Input";
import { createProfile } from "src/actions/User";
import { UserContext } from "src/contexts";
import { AuthService } from "src/utils/auth";
import AvatarInput from "src/components/inputs/AvatarInput";
import { AVATAR_SETTINGS } from "src/components/ProfileCard";
import { v4 as uuidv4 } from "uuid";
import { urlToBlob } from "src/utils/image";
import { uploadAvatar } from "src/utils/upload";
import { InternalRequestError } from "src/utils/request";
import { LocalUser } from "src/types/types";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod/dist/zod";

function getRandomAvatar(): string {
  return `https://avatars.dicebear.com/api/bottts/${uuidv4()}.svg?size=${
    AVATAR_SETTINGS.targetDim
  }`;
}

const CreateProfileSchema = z.object({
  displayName: z
    .string()
    .nonempty("Enter a display name")
    .min(4, "Must be at least 4 characters long"),
});

type CreateProfileForm = z.infer<typeof CreateProfileSchema>;

const CreateProfileScreen = () => {
  const [user, setUser] = useContext(UserContext);
  const [initialImageUrl, setInitialImageUrl] =
    useState<string>(getRandomAvatar);
  const [currentAvatarBlob, setCurrentAvatarBlob] = useState<Blob>();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<CreateProfileForm>({
    resolver: zodResolver(CreateProfileSchema),
    reValidateMode: "onSubmit",
  });

  useEffect(() => {
    if (user?.profile) {
      route("/");
    }
  }, [user]);

  useEffect(() => {
    urlToBlob(initialImageUrl).then(setCurrentAvatarBlob);
  }, [initialImageUrl, setInitialImageUrl]);

  const onSubmitCb = useCallback(
    async ({ displayName }: CreateProfileForm) => {
      if (!user) {
        throw new Error("must be logged in");
      }
      if (!currentAvatarBlob) {
        throw new Error("avatar blob is undefined");
      }

      await uploadAvatar(user, currentAvatarBlob, {});

      let profile: LocalUser | null;
      try {
        profile = await createProfile({ displayName });
      } catch (e) {
        if (!(e instanceof InternalRequestError)) {
          throw e;
        }
        if (e.message.includes("display name is taken")) {
          setError("displayName", {
            type: "custom",
            message: "Username is taken.",
          });
          return;
        }
        if (e.message.includes("profile already exists")) {
          route("/");
          return;
        }
        throw e;
      }
      await new AuthService(user, setUser).setProfile(profile);
      route("/");
    },
    [user, setUser, currentAvatarBlob]
  );
  return (
    <div class="h-full w-full flex items-center justify-center">
      <div class="form max-w-md space-y-4">
        <div>
          <h3>
            Please enter your display name. This cannot be changed. And choose
            an avatar!
          </h3>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <form onSubmit={handleSubmit(onSubmitCb) as any}>
            <div>
              <Label htmlFor="username" className="block">
                Display name
              </Label>
              <input
                {...register("displayName")}
                className={errors.displayName ? "border border-red-500" : ""}
              />
              {errors.displayName && (
                <div class="text-red-500">{errors.displayName.message}</div>
              )}
            </div>
            <div class="py-2">
              <button type="submit">Create!</button>
            </div>
          </form>
          <div>
            <AvatarInput
              initialImage={initialImageUrl}
              onChange={setCurrentAvatarBlob}
              {...AVATAR_SETTINGS}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProfileScreen;
