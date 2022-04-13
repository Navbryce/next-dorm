import { cloneElement, h, RenderableProps, VNode } from "preact";
import { classNames } from "src/utils/styling";

export enum ButtonType {
  TEXT = "text",
  CONTAINED = "contained",
}

type IconButtonProps = {
  buttonType?: ButtonType | ButtonType[keyof ButtonType];
  startIcon: VNode<any>;
};

const BUTTON_TYPE_BY_TYPE = {
  [ButtonType.TEXT]: "",
  [ButtonType.CONTAINED]: "button",
};

const BUTTON_CLASSES_BY_TYPE = {
  [ButtonType.TEXT]:
    "text-gray-300 hover:text-cyan-400 transition-all duration-200",
  [ButtonType.CONTAINED]: "",
};

const ICON_CLASSES_BY_TYPE = {
  [ButtonType.TEXT]:
    "rounded-full bg-cyan-400/0 group-hover:bg-cyan-400/20 transition-all duration-200",
  [ButtonType.CONTAINED]: "",
};

export function IconButton({
  startIcon,
  children,
  buttonType = ButtonType.CONTAINED,
  ...rest
}: RenderableProps<IconButtonProps> & h.JSX.HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={BUTTON_TYPE_BY_TYPE[buttonType as ButtonType]}
      class={classNames(
        "group",
        BUTTON_CLASSES_BY_TYPE[buttonType as ButtonType]
      )}
      {...rest}
    >
      {cloneElement(startIcon, {
        className: classNames(
          "w-4 h-4 p-2 box-content inline",
          ICON_CLASSES_BY_TYPE[buttonType as ButtonType]
        ),
      })}{" "}
      {children}
    </button>
  );
}
