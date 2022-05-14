import { useEffect, useLayoutEffect, useState } from "preact/compat";
import { getPublicUrlForImage } from "src/utils/upload";
import { h } from "preact";
import LazyLoadImage, {
  LazyLoadImageProps,
} from "src/components/LazyLoadImage";

type Props = {
  blobName: string;
} & Omit<LazyLoadImageProps, "src">;

const UploadedLazyLoadImage = ({ blobName, ...rest }: Props) => {
  const [url, setURL] = useState<string | undefined>(undefined);
  useLayoutEffect(() => {
    setURL(getPublicUrlForImage(blobName));
  }, [blobName]);

  return <LazyLoadImage src={url} {...rest} />;
};

export default UploadedLazyLoadImage;
