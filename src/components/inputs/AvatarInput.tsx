import { useCallback, useContext, useRef, useState } from "preact/compat";
import { UserContext } from "src/contexts";
import { ImageUploadInput } from "src/components/inputs/Input";
import { CameraIcon } from "@heroicons/react/solid";
import { uploadContentImage } from "src/utils/upload";
import { OnChangeProps } from "src/types/types";

type ImageTypes = string;

function drawImageOnCanvasAndGetUrl(
  file: File,
  targetDim: number,
  targetType: ImageTypes
): Promise<string> {
  return new Promise((resolve, error) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const image = new Image();
      image.onload = (event) => {
        // Resize the image
        const canvas = document.createElement("canvas");
        canvas.width = targetDim;
        canvas.height = targetDim;
        const canvasContext = canvas.getContext("2d");
        if (!canvasContext) {
          throw new Error("Canvas context is null");
        }

        let sourceSize: number;
        let sX = 0,
          sY = 0;
        if (image.width > image.height) {
          sourceSize = image.height;
          sX = Math.floor((image.width - image.height) / 2);
        } else {
          sourceSize = image.width;
          sY = Math.floor((image.height - image.width) / 2);
        }

        canvasContext.drawImage(
          image,
          sX,
          sY,
          sourceSize,
          sourceSize,
          0,
          0,
          targetDim,
          targetDim
        );
        resolve(canvas.toDataURL(`image/${targetType}`));
      };
      image.src = (event.target as { result: string }).result;
    };
    reader.readAsDataURL(file);
  });
}

type Props = {
  targetType: ImageTypes;
  targetDim: number;
  initialImage: string;
  onChange: (blob: Blob) => void;
};

const AvatarInput = ({
  targetType,
  targetDim,
  initialImage,
  onChange,
}: Props) => {
  const [user] = useContext(UserContext);

  const fileUploadEl = useRef<HTMLInputElement>(null);

  const [image, setImage] = useState(initialImage);

  const onImageChangeCb = useCallback(
    (e: Event) => {
      if (!user) {
        throw new Error("cannot create a post if not logged in");
      }

      const files = (e.target as HTMLInputElement).files;
      if (!files || files.length == 0) {
        return;
      }
      drawImageOnCanvasAndGetUrl(files[0], targetDim, targetType).then(
        (imageBase64) => {
          setImage(imageBase64);
          fetch(imageBase64).then((result) => result.blob().then(onChange));
        }
      );
    },
    [onChange, setImage]
  );

  return (
    <div
      className="inline-block relative hover:cursor-pointer"
      onClick={() => fileUploadEl.current && fileUploadEl.current.click()}
    >
      <input
        type="file"
        className="hidden"
        ref={fileUploadEl}
        onChange={onImageChangeCb}
      />
      <div className="relative">
        <img
          className="avatar hover:cursor-pointer"
          width={125}
          height={125}
          src={image}
        />
        <CameraIcon
          className="absolute bottom-[10px] right-[5px]"
          width={30}
          height={30}
        />
      </div>
    </div>
  );
};

export default AvatarInput;
