import { h } from "preact";
import { Label } from "src/components/inputs/Input";
import { useCallback, useContext, useState } from "preact/compat";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { route } from "preact-router";
import { URLS } from "src/urls";
import { AuthService, UserContext } from "src/contexts";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthenticatePrompt from "src/components/AuthenticatePrompt";

const SignInScreen = () => {
  return (
    <div class="fixed w-full h-full flex justify-center items-center">
      <AuthenticatePrompt
        className="form"
        onSignIn={() => route("/")}
        includeForgotPassword
        includeRegister
      />
    </div>
  );
};

export default SignInScreen;
