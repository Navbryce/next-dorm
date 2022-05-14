import { Fragment, FunctionalComponent, h } from "preact";
import { RouteProps } from "preact-router";
import Header from "src/components/Header";

export const Toolbar: FunctionalComponent = ({ children }) => {
  return <div className="w-[300px] sticky h-min top-0">{children}</div>;
};

export const MainContent: FunctionalComponent = ({ children }) => {
  return <div className="max-w-4xl w-full">{children}</div>;
};

export const StdLayout: FunctionalComponent = ({ children }) => {
  return <div className="w-full flex justify-center">{children}</div>;
};

export default StdLayout;

// TODO: Merge into standard layout
export function withStandardPageElements<T>(
  component: RouteProps<T>["component"],
  config?: Record<string, never>
): FunctionalComponent<T> {
  return ({ ...rest }) => {
    return (
      <div class="w-full h-full">
        <Header className="z-20 relative" />
        <div class="h-[calc(100%-120px) w-full] flex justify-center">
          {h(component, rest)}
        </div>
      </div>
    );
  };
}
