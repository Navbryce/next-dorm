// Import Swiper React components
import UploadedLazyLoadImage from "src/components/LazyUploadedImage";
import { Stylable } from "src/types/types";
// Direct React component imports
import { Swiper, SwiperSlide } from "swiper/react/swiper-react.js";
import { EffectCards, Pagination } from "swiper";
import "swiper/swiper.scss"; // core Swiper
import "swiper/modules/navigation/navigation.scss"; // Navigation module
import "swiper/modules/pagination/pagination.scss"; // Pagination module
import "swiper/modules/effect-cards/effect-cards.scss";
import { classNames } from "src/utils/styling";

type Props = {
  blobNames: string[];
  imageClassName?: string;
} & Stylable;

export const UploadedImageSlider = ({
  blobNames,
  className,
  imageClassName,
}: Props) => {
  return (
    <Swiper
      className={classNames("min-w-0 min-h-0", className ?? "")}
      pagination={true}
      effect="cards"
      modules={[EffectCards, Pagination]}
      cardsEffect={{
        slideShadows: false,
      }}
      grabCursor
    >
      {blobNames.map((blobName) => (
        <SwiperSlide
          key={blobName}
          className="flex justify-center w-full h-full"
        >
          <UploadedLazyLoadImage
            blobName={blobName}
            className={imageClassName}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default UploadedImageSlider;
