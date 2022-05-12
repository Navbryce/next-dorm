import { Fragment, FunctionalComponent, h } from "preact";

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
