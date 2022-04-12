import { FunctionalComponent, h } from "preact";

import { Post, Visibility } from "../../types/types";
import VisibilitySelect from "./VisibilitySelect";
import { useCallback, useState } from "preact/compat";
import { Input, Label, TextArea } from "./Input";

export type Values = Pick<Post, "title" | "content" | "visibility">;

type Props = {
  onSubmit: (post: Values) => void;
};
const PostDialog = ({ onSubmit }: Props) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState(Visibility.NORMAL);
  const onSubmitCb = useCallback(
    (e: Event) => {
      e.preventDefault();
      onSubmit({
        title,
        content,
        visibility,
      });
    },
    [onSubmit, title, content, visibility]
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
      </div>
      <div>
        <VisibilitySelect value={visibility} onChange={setVisibility} />
      </div>
      <div>
        <button onClick={onSubmitCb}>Submit</button>
      </div>
    </form>
  );
};
export default PostDialog;
