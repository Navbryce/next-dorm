import { cloneElement, FunctionalComponent, h } from "preact";
import { route, RouteProps } from "preact-router";
import Header from "src/components/Header";
import { IconButton } from "src/components/inputs/Button";
import { ChevronLeftIcon } from "@heroicons/react/outline";
import { Children } from "preact/compat";
import { Stylable } from "src/types/types";
import { URLS } from "src/urls";
import { classNames } from "src/utils/styling";

export const BackButton = ({ url }: { url: string }) => (
  <IconButton
    buttonType="text"
    className="mt-5 relative left-[-25px]"
    startIcon={<ChevronLeftIcon width={25} height={25} />}
    onClick={() => route(url)}
  >
    <h3 className="mt-0 inline">Back</h3>
  </IconButton>
);

export const Toolbar: FunctionalComponent<{ isRight?: boolean }> = ({
  children,
  isRight,
}) => {
  const content = isRight ? (
    <div className="w-full h-[calc(100vh-100px)] flex flex-col justify-between">
      <div>{children}</div>
      <RightToolbarFooter />
    </div>
  ) : (
    children
  );

  // self-start to make sticky work within a flexbox
  return (
    <div className="w-[300px] self-start sticky top-[101px] min-content">
      {content}
    </div>
  );
};

export const RightToolbarFooter = ({ className }: Stylable) => {
  return (
    <div className={classNames("w-full", className ?? "")}>
      <a href={URLS.pages.about} className="link">
        <h3>About NextDorm</h3>
      </a>
    </div>
  );
};

export const MainContent: FunctionalComponent = ({ children }) => {
  return <div className="max-w-4xl w-full">{children}</div>;
};

export const Title: FunctionalComponent = ({ children }) => {
  return <h1>{children}</h1>;
};

export const StdLayout: FunctionalComponent = ({ children }) => {
  const childrenArray = Children.toArray(children);
  return (
    <div className="w-full relative flex justify-center">
      {childrenArray.slice(0, 2)}
      {childrenArray.length > 2 &&
        childrenArray[2].type == Toolbar &&
        cloneElement(childrenArray[2], {
          isRight: true,
          ...childrenArray[2].props,
        })}
    </div>
  );
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
        <Header className="z-40 relative top-0 left-0 w-full" />
        <div class="relative h-[calc(100%-101px) w-full] flex justify-center">
          {h(component, rest)}
        </div>
      </div>
    );
  };
}
