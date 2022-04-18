import { useEffect, useLayoutEffect, useState } from "preact/compat";
import { getUrl } from "src/utils/upload";
import { h } from "preact";
import {
  LazyLoadImageProps,
  LazyLoadImage,
} from "react-lazy-load-image-component";

type Props = {
  blobName: string;
} & Omit<LazyLoadImageProps, "src">;

const UploadedImage = ({ blobName, ...rest }: Props) => {
  const [url, setURL] = useState<string | undefined>(undefined);
  useLayoutEffect(() => {
    getUrl(blobName).then(setURL);
  }, [blobName]);

  if (!url) {
    return <div />;
  }

  return <LazyLoadImage src={url} {...rest} />;
};

export default UploadedImage;
