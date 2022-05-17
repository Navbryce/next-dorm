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
  [ButtonType.TEXT]: "button",
  [ButtonType.CONTAINED]: "button",
};

const BUTTON_CLASSES_BY_TYPE = {
  [ButtonType.TEXT]:
    "text-cyan-400 hover:bg-cyan-400/20 rounded-full transition-all duration-200 disabled:!bg-red",
  [ButtonType.CONTAINED]: "",
};

const ICON_CLASSES_BY_TYPE = {
  [ButtonType.TEXT]:
    "rounded-full p-1 bg-cyan-400/0 group-hover:bg-cyan-400/20 transition-all duration-200",
  [ButtonType.CONTAINED]: "",
};

export function IconButton({
  startIcon,
  children,
  buttonType = ButtonType.CONTAINED,
  className,
  ...rest
}: RenderableProps<IconButtonProps> & h.JSX.HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      class={classNames(
        "group p-2",
        className ?? "",
        BUTTON_CLASSES_BY_TYPE[buttonType as ButtonType]
      )}
      {...rest}
      type={BUTTON_TYPE_BY_TYPE[buttonType as ButtonType]}
    >
      {cloneElement(startIcon, {
        className: classNames(
          "box-content inline",
          ICON_CLASSES_BY_TYPE[buttonType as ButtonType],
          startIcon.props.className
        ),
        width: startIcon.props.width ?? 20,
        height: startIcon.props.height ?? 20,
      })}{" "}
      {children}
    </button>
  );
}
