import { CheckCircleIcon } from "@heroicons/react/solid";

type Props = {
  isSubscribed: boolean;
  onClick: () => void;
};

const SubscribeButton = ({ isSubscribed, onClick }: Props) => {
  return (
    <button className="inline-block btn" type="button" onClick={onClick}>
      {isSubscribed ? (
        <div>
          <CheckCircleIcon className="inline" width="15" height="15" />
          Following
        </div>
      ) : (
        <div>Follow</div>
      )}
    </button>
  );
};
export default SubscribeButton;
