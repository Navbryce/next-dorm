import { h } from "preact";
import UploadedLazyLoadImage from "src/components/LazyUploadedImage";
import { Stylable } from "src/types/types";
import { XCircleIcon } from "@heroicons/react/outline";
import { classNames } from "src/utils/styling";
import { IconButton } from "src/components/inputs/Button";
import { useState } from "preact/compat";

type Props = {
  progress?: number;
  blobName?: string;
  onCancel: () => void;
} & Stylable;

const UploadedImagePreview = ({ className, blobName, onCancel }: Props) => {
  const [loaded, setLoaded] = useState(false);
  if (!blobName) {
    return <div />;
  }

  return (
    <div className={classNames("relative", className ?? "")}>
      <UploadedLazyLoadImage
        blobName={blobName}
        afterLoad={() => setLoaded(true)}
        className="max-w-screen-md max-h-[200px]"
      />
      {loaded && (
        <div className="absolute left-0 top-0 z-1">
          <IconButton
            buttonType="text"
            startIcon={<XCircleIcon width={55} height={55} />}
            onClick={onCancel}
          />
        </div>
      )}
    </div>
  );
};
export default UploadedImagePreview;
