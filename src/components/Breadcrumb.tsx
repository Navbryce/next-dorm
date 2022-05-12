import { FunctionalComponent, h } from "preact";
import { Children } from "preact/compat";
import { ChevronRightIcon } from "@heroicons/react/solid";

export const BreadcrumbItem: FunctionalComponent = ({ children }) => {
  return <div className="inline">{children}</div>;
};

const Breadcrumb: FunctionalComponent = ({ children }) => {
  return (
    <div className="flex w-full text-cyan-400">
      {Children.toArray(children).map((child, i) => (
        <div key={i}>
          {i > 0 && (
            <ChevronRightIcon height={25} width={25} className="inline" />
          )}
          {child}
        </div>
      ))}
    </div>
  );
};

export default Breadcrumb;
