import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "preact/compat";
import { UserContext } from "src/contexts";
import AvatarInput from "src/components/inputs/AvatarInput";
import { getPublicUrlForImage, uploadAvatar } from "src/utils/upload";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod/dist/zod";
import { Label } from "src/components/inputs/Input";
import { getAuth, updatePassword, User as FirebaseUser } from "firebase/auth";
import { User } from "src/types/types";
import { Dialog } from "@headlessui/react";
import AuthenticatePrompt from "src/components/AuthenticatePrompt";
import Alert from "src/components/Alert";
import { withAuth } from "src/components/wrappers/Auth";
import { withStandardPageElements } from "src/components/StdLayout";
import { AVATAR_SETTINGS } from "src/components/ProfileCard";

const UpdatePasswordSchema = z
  .object({
    password: z.string().nonempty("Enter a password"),
    confirmPassword: z.string().nonempty("Confirm password"),
  })
  .refine(({ password, confirmPassword }) => password == confirmPassword, {
    message: "Passwords do not match",
    path: ["password"],
  });

type UpdatePasswordForm = z.infer<typeof UpdatePasswordSchema>;

const PasswordUpdateForm = ({
  user,
  reauthenticate,
  showSaveDialog,
}: {
  user: User;
  reauthenticate: (cb: () => void) => void;
  showSaveDialog: (content: string) => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<UpdatePasswordForm>({
    resolver: zodResolver(UpdatePasswordSchema),
    reValidateMode: "onSubmit",
  });

  const onUpdateCb = useCallback(
    ({ password }: UpdatePasswordForm) => {
      reset();
      updatePassword(getAuth().currentUser as FirebaseUser, password)
        .then(() => {
          showSaveDialog("Password updated");
        })
        .catch(({ message, code }) => {
          switch (code) {
            case "auth/weak-password":
              setError("password", {
                type: "custom",
                message: "Needs stronger password",
              });
              break;
            case "auth/requires-recent-login":
              reauthenticate(() =>
                onUpdateCb({ password, confirmPassword: password })
              );
              break;
            default:
              throw new Error(message);
          }
        });
    },
    [setError, reauthenticate]
  );

  return (
    <form onSubmit={handleSubmit(onUpdateCb) as any}>
      <div>
        <Label htmlFor="password" className="block">
          Password
        </Label>
        <input type="password" {...register("password")} />
        {errors.password && (
          <div class="text-red-500">{errors.password.message}</div>
        )}
      </div>
      <div>
        <Label htmlFor="confirmPassword" className="block">
          Confirm Password
        </Label>
        <input
          type="password"
          className={errors.confirmPassword ? "border border-red-500" : ""}
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <div class="text-red-500">{errors.confirmPassword.message}</div>
        )}
      </div>
      <button type="submit">Update password</button>
    </form>
  );
};

const SettingsScreen = () => {
  const [user] = useContext(UserContext);
  const [reauthenticatePanel, setReauthenticatePanel] = useState<
    { cb:() => void } | undefined
  >();

  const [initialImage, setInitialImage] = useState<string | undefined>();
  const [savedMessage, setSavedMessage] = useState<string | undefined>();

  const userProfileBlobName = useMemo(
    () => user?.profile?.avatarBlobName,
    [user]
  );

  useEffect(() => {
    if (!userProfileBlobName) {
      return;
    }
    setInitialImage(getPublicUrlForImage(userProfileBlobName));
  }, [userProfileBlobName, setInitialImage]);

  const onAvatarCb = useCallback(
    (blob: Blob) => {
      if (!user) {
        throw new Error("must be logged in");
      }
      uploadAvatar(user, blob, {});
    },
    [user]
  );

  const sendSettingsUpdateNotification = useCallback(
    (content: string) => {
      setSavedMessage(content);
      setTimeout(() => setSavedMessage(undefined), 2000);
    },
    [setSavedMessage]
  );

  if (!user?.profile) {
    return <div />;
  }
  return (
    <div>
      <Alert open={!!savedMessage}>{savedMessage}</Alert>
      <Dialog
        as="div"
        open={!!reauthenticatePanel}
        onClose={() => setReauthenticatePanel(undefined)}
      >
        <div className="fixed w-screen h-screen inset-0 backdrop-blur">
          <div className="w-full h-full flex justify-center items-center">
            <Dialog.Panel className="form">
              <p>Reauthenticate to update sensitive information</p>
              {reauthenticatePanel && (
                <AuthenticatePrompt onSignIn={reauthenticatePanel.cb} />
              )}
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
      <table>
        <tr>
          <td className="pr-2">
            <h2>Avatar</h2>
          </td>
          <td>
            <div>
              {initialImage && (
                <AvatarInput
                  {...AVATAR_SETTINGS}
                  initialImage={initialImage}
                  onChange={onAvatarCb}
                />
              )}
            </div>
            <span>Refresh to see avatar update apply</span>
          </td>
        </tr>
        <tr>
          <td className="pr-2">
            <h2>Change password</h2>
          </td>
          <td>
            <PasswordUpdateForm
              user={user}
              reauthenticate={(cb) =>
                setReauthenticatePanel({
                  cb: () => {
                    setReauthenticatePanel(undefined);
                    cb();
                  },
                })
              }
              showSaveDialog={sendSettingsUpdateNotification}
            />
          </td>
        </tr>
      </table>
    </div>
  );
};

export default withStandardPageElements(
  withAuth(SettingsScreen, { requireProfile: true })
);
