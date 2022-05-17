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

type Props = {
  blobNames: string[];
  cardClassName?: string;
} & Stylable;

export const UploadedImageSlider = ({
  blobNames,
  className,
  cardClassName,
}: Props) => {
  return (
    <Swiper
      className={className}
      effect="cards"
      modules={[EffectCards, Pagination]}
      cardsEffect={{
        slideShadows: false,
      }}
      pagination={true}
      grabCursor
    >
      {blobNames.map((blobName) => (
        <SwiperSlide key={blobName}>
          <UploadedLazyLoadImage
            className={cardClassName}
            blobName={blobName}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default UploadedImageSlider;
