import {SignInConfig} from "../routes/signin";
import {URLS} from "../urls";
import {route} from "preact-router";

export function signIn(signInConfig: SignInConfig) {
  const urlParams = new URLSearchParams();
  if (signInConfig.redirectUrl) {
    urlParams.append("redirect", signInConfig.redirectUrl)
  }
  const urlParamsString = `?${urlParams.toString()}`;
  route(`${URLS.pages.signIn}${urlParamsString.length > 0 ? urlParamsString : "" }`, false);
}