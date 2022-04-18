import { FunctionalComponent, h } from "preact";

import { Post, Visibility } from "src/types/types";
import VisibilitySelect from "./VisibilitySelect";
import { useCallback, useContext, useState } from "preact/compat";
import { ImageUploadInput, Input, Label, TextArea } from "./Input";
import { UserContext } from "src/contexts";
import { uploadImage } from "src/utils/upload";
import update from "immutability-helper";
import UploadedImagePreview from "src/components/UploadedImagePreview";

export type Values = Pick<
  Post,
  "title" | "content" | "imageBlobNames" | "visibility"
>;

type Props = {
  onSubmit: (post: Values) => void;
};

type UploadedImage = {
  blobName: string;
  url: string;
};

const PostDialog = ({ onSubmit }: Props) => {
  const [user] = useContext(UserContext);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState(Visibility.NORMAL);

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [uploadProgresses, setUploadProgresses] = useState<number[]>([]);
  const [imageBlobNames, setImageBlobNames] = useState<
    Array<string | undefined>
  >([]);

  const onSubmitCb = useCallback(
    (e: Event) => {
      e.preventDefault();
      if (imageBlobNames.some((value) => value == undefined)) {
        // TODO: upload still in progress. add message
        return;
      }

      onSubmit({
        title,
        content,
        imageBlobNames: imageBlobNames as string[],
        visibility,
      });
    },
    [onSubmit, title, content, imageBlobNames, visibility]
  );

  const onImageChangeCb = useCallback(
    (e: Event) => {
      if (!user) {
        throw new Error("cannot create a post if not logged in");
      }

      const files = (e.target as HTMLInputElement).files;
      if (!files || files.length == 0) {
        return;
      }

      const i = imageFiles.length;
      setImageFiles([...imageFiles, files[0]]);
      setUploadProgresses([...uploadProgresses, 0]);
      setImageBlobNames([...imageBlobNames, undefined]);
      uploadImage(user, files[0], {
        onProgress: (progress) =>
          setUploadProgresses(
            update(uploadProgresses, { [i]: { $set: progress } })
          ),
      }).then((blobName) =>
        setImageBlobNames(update(imageBlobNames, { [i]: { $set: blobName } }))
      );
    },
    [
      imageFiles,
      setImageFiles,
      uploadProgresses,
      setUploadProgresses,
      imageBlobNames,
      setImageBlobNames,
    ]
  );

  return (
    <form class="max-w-4xl">
      <div>
        <Label className="block font-bold" htmlFor="title">
          Title
        </Label>
        <Input
          className="w-full"
          name="title"
          value={title}
          onChange={(e) => setTitle((e.target as HTMLInputElement).value)}
        />
      </div>
      <div>
        <Label className="block" htmlFor="content">
          Content
        </Label>
        <TextArea
          className="w-full"
          name="content"
          value={content}
          onChange={(e) => setContent((e.target as HTMLInputElement).value)}
        />
        <ImageUploadInput onChange={onImageChangeCb} />
      </div>
      <div>
        {imageFiles.map((file, i) => (
          <UploadedImagePreview
            key={i}
            progress={uploadProgresses[i]}
            blobName={imageBlobNames[i]}
          />
        ))}
      </div>
      <div>
        <VisibilitySelect value={visibility} onChange={setVisibility} />
      </div>
      <div>
        <button type="submit" onClick={onSubmitCb}>
          Submit
        </button>
      </div>
    </form>
  );
};
export default PostDialog;
