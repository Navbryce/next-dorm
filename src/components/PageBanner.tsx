import { FunctionalComponent } from "preact";

const PageBanner: FunctionalComponent = ({ children }) => {
  return (
    <div className="p-4 border-b border-secondary-100 w-full">{children}</div>
  );
};

export default PageBanner;
