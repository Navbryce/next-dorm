import { useCallback, useEffect, useRef, useState } from "preact/compat";
import VisibilitySelect from "./VisibilitySelect";
import { Stylable, Visibility } from "src/types/types";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod/dist/zod";
import { classNames } from "src/utils/styling";
import { h } from "preact";

const CommentSchema = z.object({
  content: z.string().nonempty(),
  visibility: z.nativeEnum(Visibility),
});

export type Values = z.infer<typeof CommentSchema>;

type Props = {
  initialValues?: Values;
  submitButtonLabel: string;
  onSubmit: (content: Values) => Promise<void>;
  onCancel?: () => void;
  onClick?: h.JSX.MouseEventHandler<HTMLFormElement>;
} & Stylable;

const CommentDialog = ({
  initialValues,
  onSubmit,
  onCancel,
  onClick,
  submitButtonLabel,
  className,
}: Props) => {
  const isMountedRef = useRef(false);
  const [shouldReset, setShouldReset] = useState(false);

  const { register, handleSubmit, control, reset } = useForm<Values>({
    defaultValues: initialValues,
    resolver: zodResolver(CommentSchema),
    reValidateMode: "onSubmit",
  });

  useEffect(() => {
    isMountedRef.current = true;
    return () => (isMountedRef.current = false);
  });

  const onSubmitCb = useCallback(
    (values: Values) => {
      onSubmit(values).then(() => isMountedRef.current && setShouldReset(true));
      // reset in useeffect https://react-hook-form.com/api/useform/reset/
    },
    [onSubmit]
  );

  useEffect(() => {
    if (isMountedRef.current && shouldReset) {
      setShouldReset(false);
      reset();
    }
  }, [shouldReset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmitCb) as any}
      onClick={onClick}
      className={classNames("border-b border-secondary-100", className ?? "")}
    >
      <input
        className="w-4/5"
        placeholder="This is a comment..."
        {...register("content")}
      />
      <div className="flex space-x-2 py-4">
        <div>
          <Controller
            render={({ field }) => <VisibilitySelect {...field} />}
            name="visibility"
            control={control}
            defaultValue={Visibility.NORMAL}
          />
        </div>
        <div>
          <button type="submit" className="btn">
            {submitButtonLabel}
          </button>
        </div>
        {onCancel && (
          <div onClick={onCancel} className="inline">
            <button type="button" className="btn">
              Cancel
            </button>
          </div>
        )}
      </div>
    </form>
  );
};

export default CommentDialog;
