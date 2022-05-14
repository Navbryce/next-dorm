import { Route as PreactRoute, RouteProps } from "preact-router";
import { AuthConfig, withAuth } from "src/components/wrappers/Auth";

type Props<T> = RouteProps<T> & Partial<T> & AuthConfig<T>;

export function Route<T>({
  component,
  requireSession,
  requireProfile,
  ...rest
}: Props<T>) {
  return (
    <PreactRoute
      component={withAuth(component, { requireSession, requireProfile })}
      {...(rest as Partial<T>)}
    />
  );
}

export default Route;
