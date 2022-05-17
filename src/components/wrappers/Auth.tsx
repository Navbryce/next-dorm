import { route, RouteProps } from "preact-router";
import { FunctionComponent, h, VNode } from "preact";
import { useContext, useRef } from "preact/compat";
import { UserContext } from "src/contexts";
import { URLS } from "src/urls";

export type AuthConfig<T> = {
  requireSession?: boolean;
  requireProfile?: boolean;
};

export function withAuth<T>(
  component: RouteProps<T>["component"],
  {
    requireSession = true,
    requireProfile = true, // session is required if profile is requied
  }: AuthConfig<T>
) {
  const WrappedComponent: FunctionComponent<T> = (props) => {
    const [user] = useContext(UserContext);
    const renderedPage = useRef<VNode | undefined>();

    if ((requireSession || requireProfile) && !user) {
      route(URLS.pages.users.signIn);
      return <div />;
    }

    if (
      requireProfile &&
      (!user?.firebaseUser.emailVerified || !user?.profile)
    ) {
      return <div />;
    }
    if (!renderedPage.current) {
      renderedPage.current = h(component, props);
    }
    return renderedPage.current;
  };
  return WrappedComponent;
}
