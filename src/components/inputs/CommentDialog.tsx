import { FunctionalComponent, h } from "preact";

import { useCallback, useState } from "preact/compat";
import { ReplyIcon } from "@heroicons/react/outline";
import VisibilitySelect from "./VisibilitySelect";
import { Comment, Visibility } from "../../types/types";
import { Input } from "./Input";

export type Values = Pick<Comment, "content" | "visibility">;

type Props = {
  onSubmit: (content: Values) => void;
};

const CommentDialog = ({ onSubmit }: Props) => {
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState(Visibility.NORMAL);
  const onSubmitCb = useCallback(() => {
    onSubmit({ content, visibility });
  }, [onSubmit, content]);

  return (
    <div class="border-b border-secondary-100">
      <Input
        class="w-4/5"
        value={content}
        onChange={(e) => setContent((e.target as HTMLTextAreaElement).value)}
      />
      <div onClick={onSubmitCb}>
        <ReplyIcon className="inline" width="15" height="15" />
        Submit
      </div>
      <VisibilitySelect value={visibility} onChange={setVisibility} />
    </div>
  );
};

export default CommentDialog;
