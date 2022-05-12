import { h } from "preact";
import { ImageUploadInput, Label } from "src/components/inputs/Input";
import UploadedImagePreview from "src/components/UploadedImagePreview";
import VisibilitySelect from "src/components/inputs/VisibilitySelect";
import { useCallback, useContext, useEffect, useState } from "preact/compat";
import { Visibility } from "src/types/types";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import update from "immutability-helper";
import { uploadContentImage } from "src/utils/upload";
import { UserContext } from "src/contexts";

const EditPostSchema = z.object({
  title: z.string().nonempty(),
  content: z.string().nonempty(),
  visibility: z.nativeEnum(Visibility),
});

type EditPostForm = z.infer<typeof EditPostSchema>;

export type Values = {
  imageBlobNames: string[];
} & EditPostForm;

type Props = {
  initialValues: Values;
  onSubmit: (values: Values) => void;
};

const EditPostDialog = ({ initialValues, onSubmit }: Props) => {
  const [user] = useContext(UserContext);

  const [imageBlobNames, setImageBlobNames] = useState<
    Array<string | null | undefined>
  >([]);

  useEffect(() => {
    setImageBlobNames(initialValues.imageBlobNames);
  }, [initialValues]);

  const { register, handleSubmit, control } = useForm<EditPostForm>({
    defaultValues: initialValues,
    resolver: zodResolver(EditPostSchema),
    reValidateMode: "onSubmit",
  });

  const onSubmitCb = useCallback(
    (values: EditPostForm) => {
      // TODO: Handle edge case where not all images are saved
      onSubmit({
        imageBlobNames: imageBlobNames.filter(
          (value) => value != null
        ) as string[],
        ...values,
      });
    },
    [initialValues, imageBlobNames]
  );

  const onImageChangeCb = useCallback(
    (e: Event) => {
      if (!user) {
        throw new Error("cannot edit a post if not logged in");
      }

      const files = (e.target as HTMLInputElement).files;
      if (!files || files.length == 0) {
        return;
      }

      const i = imageBlobNames.length;
      setImageBlobNames([...imageBlobNames, undefined]);
      uploadContentImage(user, files[0], {}).then((blobName) => {
        setImageBlobNames(
          update(imageBlobNames, {
            [i]: {
              $set: blobName,
            },
          })
        );
        // TODO: Create image blob field supported by useForm
      });
    },
    [imageBlobNames, setImageBlobNames]
  );

  const onImageCancelCb = useCallback(
    (i: number) => {
      setImageBlobNames(
        update(imageBlobNames, {
          [i]: {
            $set: null,
          },
        })
      );
    },
    [imageBlobNames, setImageBlobNames]
  );

  /* TODO: Combine with create post
      and put action specific information on screens
   */

  return (
    <form className="form max-w-4xl" onSubmit={handleSubmit(onSubmitCb) as any}>
      <div>
        <Label className="block font-bold" htmlFor="title">
          Title
        </Label>
        <input className="w-full" {...register("title")} />
      </div>
      <div>
        <Label className="block" htmlFor="content">
          Content
        </Label>
        <textarea className="w-full" {...register("content")} />
        <ImageUploadInput onChange={onImageChangeCb} />
      </div>
      <div>
        {imageBlobNames
          .filter((blobName) => blobName != null)
          .map((blobName, i) => (
            <UploadedImagePreview
              key={i}
              blobName={blobName as string | undefined}
              onCancel={() => onImageCancelCb(i)}
            />
          ))}
      </div>
      <div>
        <Controller
          render={({ field }) => <VisibilitySelect {...field} />}
          name="visibility"
          control={control}
          defaultValue={Visibility.NORMAL}
        />
      </div>
      <div>
        <button type="submit">Submit</button>
      </div>
    </form>
  );
};

export default EditPostDialog;
