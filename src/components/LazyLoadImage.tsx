import { h } from "preact";
import {
  LazyLoadImageProps as ExtLazyLoadImageProps,
  LazyLoadImage as ExtLazyLoadImage,
} from "react-lazy-load-image-component";

export type LazyLoadImageProps = Omit<ExtLazyLoadImageProps, "placeholder">;
const LazyLoadImage = (props: Omit<LazyLoadImageProps, "placeholder">) => {
  return <ExtLazyLoadImage effect="blur" {...props} />;
};

export default LazyLoadImage;
