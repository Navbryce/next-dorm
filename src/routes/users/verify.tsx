import { withAuth } from "src/components/wrappers/Auth";
import { useCallback, useContext, useEffect, useState } from "preact/compat";
import { UserContext } from "src/contexts";
import { sendEmailVerification } from "firebase/auth";
import { AuthService, mustGetCurrentFirebaseUser } from "src/utils/auth";
import { URLS } from "src/urls";
import { LightningBoltIcon } from "@heroicons/react/solid";
import { route } from "preact-router";

const VerifyScreen = () => {
  const [user, setUser] = useContext(UserContext);
  const [sendingEmail, setSendingEmail] = useState(true);

  const sendEmailVerificationCb = useCallback(async () => {
    if (!user) {
      throw new Error("must be logged in");
    }
    if (await new AuthService(user, setUser).refreshEmailVerifiedStatus()) {
      route("/");
      return;
    }
    await sendEmailVerification(mustGetCurrentFirebaseUser(user), {
      url: URLS.feRoot,
    });
  }, [user, setSendingEmail]);

  useEffect(() => {
    setSendingEmail(true);
    sendEmailVerificationCb().then(() => setSendingEmail(false));
  }, [sendEmailVerificationCb]);
  if (sendingEmail) {
    return <div />;
  }

  return (
    <div className="fixed inset-0 z-10 w-screen h-screen flex justify-center items-center">
      <div className="form max-w-screen-lg">
        <h2 className="align-middle">
          <LightningBoltIcon
            className="inline align-middle"
            width={40}
            height={40}
          />
          Are you real?
        </h2>
        <div className="space-y-5">
          <div>
            An email has been sent to you. Please hit the link contained within
            the email.
            <br />
            Can't find the email? Check your spam!
          </div>
          <button className="btn" onClick={sendEmailVerificationCb}>
            Resend
          </button>
        </div>
      </div>
    </div>
  );
};

export default withAuth(VerifyScreen, {
  requireSession: true,
  requireProfile: false,
});
