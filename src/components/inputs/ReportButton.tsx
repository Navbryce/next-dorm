import { h } from "preact";
import { IconButton } from "src/components/inputs/Button";
import { FlagIcon } from "@heroicons/react/outline";

const ReportButton = (props: h.JSX.HTMLAttributes<HTMLButtonElement>) => {
  return (
    <IconButton
      buttonType="text"
      height={25}
      startIcon={<FlagIcon />}
      {...props}
    >
      Report
    </IconButton>
  );
};

export default ReportButton;
