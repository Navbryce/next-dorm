import { v4 as uuidv4 } from "uuid";
import {
  cloneElement,
  ComponentChild,
  Fragment,
  RenderableProps,
  VNode,
} from "preact";
import { Children, createPortal, useEffect, useState } from "preact/compat";
import ReactTooltip from "react-tooltip";

export type TooltipConfig = {
  contents: ComponentChild;
};

const tooltipContainer = document.createElement("div");
document.body.appendChild(tooltipContainer);

const Tooltip = ({ contents, children }: RenderableProps<TooltipConfig>) => {
  const [id] = useState(uuidv4());

  useEffect(() => {
    ReactTooltip.rebuild();
  }, []);

  if (!children) {
    return <div />;
  }

  return (
    <Fragment>
      {cloneElement(Children.only(children) as VNode<any>, {
        "data-tip": "",
        "data-for": id,
      })}
      {createPortal(
        <ReactTooltip id={id}>{contents}</ReactTooltip>,
        tooltipContainer
      )}
    </Fragment>
  );
};

export default Tooltip;
