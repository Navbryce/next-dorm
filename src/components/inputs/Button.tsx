import { cloneElement, h, RenderableProps, VNode } from "preact";
import { classNames } from "src/utils/styling";
import Tooltip, { TooltipConfig } from "src/components/Tooltip";

function getClassesForStatus(
  {
    all,
    enabled = "",
    disabled = "",
  }: { all: string; enabled?: string; disabled?: string },
  isDisabled = false
) {
  return classNames(all, isDisabled ? disabled : enabled);
}

export enum ButtonType {
  TEXT = "text",
  CONTAINED = "contained",
}

type IconButtonProps = {
  buttonType?: ButtonType | ButtonType[keyof ButtonType];
  startIcon: VNode<any>;
  tooltip?: TooltipConfig;
};
const BUTTON_TYPE_BY_TYPE = {
  [ButtonType.TEXT]: "button",
  [ButtonType.CONTAINED]: "button",
};

const BUTTON_CLASSES_BY_TYPE = {
  [ButtonType.TEXT]: {
    all: "rounded-full",
    enabled: "text-cyan-400 hover:bg-cyan-400/20 transition-all duration-200",
    disabled: "text-primary-600",
  },
  [ButtonType.CONTAINED]: {
    all: "btn",
  },
};
const ICON_CLASSES_BY_TYPE = {
  [ButtonType.TEXT]: {
    all: "rounded-full p-1",
    enabled:
      "bg-cyan-400/0 group-hover:bg-cyan-400/20 transition-all duration-200",
  },
  [ButtonType.CONTAINED]: {
    all: "",
  },
};

export function IconButton({
  startIcon,
  children,
  buttonType = ButtonType.CONTAINED,
  tooltip,
  className,
  ...rest
}: RenderableProps<IconButtonProps> & h.JSX.HTMLAttributes<HTMLButtonElement>) {
  const button = (
    <button
      className={classNames(
        "group p-2 inline",
        className ?? "",
        BUTTON_CLASSES_BY_TYPE[buttonType as ButtonType]?.all ?? "",
        getClassesForStatus(
          BUTTON_CLASSES_BY_TYPE[buttonType as ButtonType],
          rest.disabled
        )
      )}
      {...rest}
      type={BUTTON_TYPE_BY_TYPE[buttonType as ButtonType]}
    >
      <div className="flex items-center">
        {cloneElement(startIcon, {
          className: classNames(
            "box-content inline",
            getClassesForStatus(
              ICON_CLASSES_BY_TYPE[buttonType as ButtonType],
              rest.disabled
            ),
            startIcon.props.className
          ),
          width: startIcon.props.width ?? 20,
          height: startIcon.props.height ?? 20,
        })}{" "}
        {children}
      </div>
    </button>
  );
  if (!tooltip || rest.disabled) {
    return button;
  }
  return <Tooltip {...tooltip}>{button}</Tooltip>;
}
