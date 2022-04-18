import { h } from "preact";
import { CheckCircleIcon } from "@heroicons/react/solid";

type Props = {
  isSubscribed: boolean;
  onClick: () => void;
};

const SubscribeButton = ({ isSubscribed, onClick }: Props) => {
  return (
    <button class="inline-block btn" type="button" onClick={onClick}>
      {isSubscribed ? (
        <div>
          <CheckCircleIcon className="inline" width="15" height="15" />
          <span class="inline">Following</span>
        </div>
      ) : (
        <div>
          <span class="inline">Follow</span>
        </div>
      )}
    </button>
  );
};
export default SubscribeButton;
