import { h } from "preact";
import { classNames } from "src/utils/styling";

// TODO: Switch to tailwind styles.scss?
export const Label = ({
  className,
  children,
  ...rest
}: h.JSX.HTMLAttributes<HTMLLabelElement>) => {
  return (
    <label className={classNames("font-bold py-2", className ?? "")} {...rest}>
      {children}
    </label>
  );
};

const COMMON_INPUT_CLASSES =
  "bg-slate-800 p-2 rounded leading-tight focus:outline-none focus:shadow-outline w-full";

export const Input = ({
  className,
  ...rest
}: h.JSX.HTMLAttributes<HTMLInputElement>) => {
  return (
    <input
      className={classNames(COMMON_INPUT_CLASSES, className ?? "")}
      {...rest}
    />
  );
};

export const TextArea = ({
  className,
  ...rest
}: h.JSX.HTMLAttributes<HTMLTextAreaElement>) => {
  return (
    <textarea
      className={classNames(COMMON_INPUT_CLASSES, className ?? "")}
      {...rest}
    />
  );
};
