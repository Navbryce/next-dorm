import { h } from "preact";
import UploadedImage from "src/components/UploadedImage";

type Props = {
  progress: number;
  blobName?: string;
};

const UploadedImagePreview = ({ progress, blobName }: Props) => {
  return (
    <div>
      <p>{progress}</p>
      {blobName && <UploadedImage blobName={blobName} />}
    </div>
  );
};
export default UploadedImagePreview;
