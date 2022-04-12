import { FunctionComponent, h } from "preact";
import { Route as PreactRoute, route, RouteProps } from "preact-router";
import { useContext } from "preact/compat";
import { UserContext } from "src/contexts";
import { URLS } from "src/urls";

type AuthConfig = {
  requireSession?: boolean;
  requireProfile?: boolean;
};

function AuthWrapper<T>(
  component: RouteProps<T>["component"],
  { requireSession = true, requireProfile = true }: AuthConfig
) {
  const WrappedComponent: FunctionComponent<T> = (props) => {
    const [user] = useContext(UserContext);

    if (requireSession && !user) {
      route(URLS.pages.user.signIn);
      return <div />;
    }

    if (requireSession && requireProfile && !user?.profile) {
      route(URLS.pages.user.createProfile);
      return <div />;
    }
    return h(component, props);
  };
  return WrappedComponent;
}

type Props<T> = RouteProps<T> & Partial<T> & AuthConfig;

export function Route<T>({
  component,
  requireSession,
  requireProfile,
  ...rest
}: Props<T>) {
  return (
    <PreactRoute
      component={AuthWrapper(component, { requireSession, requireProfile })}
      {...(rest as Partial<T>)}
    />
  );
}

export default Route;
