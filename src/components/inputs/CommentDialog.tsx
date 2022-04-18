import { h } from "preact";

import { useCallback, useState } from "preact/compat";
import VisibilitySelect from "./VisibilitySelect";
import { Comment, StateProps, Visibility } from "src/types/types";
import { Input } from "./Input";

export type Values = Pick<Comment, "content" | "visibility">;

type Props = {
  onSubmit: (content: Values) => void;
  onCancel?: () => void;
} & StateProps<{ content: string }>;

const CommentDialog = ({ content, setContent, onSubmit, onCancel }: Props) => {
  const [visibility, setVisibility] = useState(Visibility.NORMAL);
  const onSubmitCb = useCallback(() => {
    onSubmit({ content, visibility });
  }, [onSubmit, content]);

  return (
    <div class="border-b border-secondary-100">
      <Input
        class="w-4/5"
        placeholder="This is a comment..."
        value={content}
        onChange={(e) => setContent((e.target as HTMLTextAreaElement).value)}
      />
      <div class="space-x-2 py-4">
        <VisibilitySelect
          value={visibility}
          onChange={setVisibility}
          className="inline-block"
        />
        <div onClick={onSubmitCb} className="inline">
          <button type="button" class="btn" disabled={content.length == 0}>
            Reply
          </button>
        </div>
        {onCancel && (
          <div onClick={onCancel} className="inline">
            <button type="button" class="btn">
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentDialog;
