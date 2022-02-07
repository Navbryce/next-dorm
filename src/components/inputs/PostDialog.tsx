import { FunctionalComponent, h } from "preact";

import { Post, Visibility } from "../../model/types";
import VisibilitySelect from "./VisibilitySelect";
import { useCallback, useState } from "preact/compat";

export type Values = Pick<Post, "title" | "content" | "visibility">;

type Props = {
  onSubmit: (post: Values) => void;
};
const PostDialog = ({ onSubmit }: Props) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState(Visibility.NORMAL);
  const onSubmitCb = useCallback(() => {
    onSubmit({
      title,
      content,
      visibility,
    });
  }, [onSubmit, title, content, visibility]);
  return (
    <div>
      <div>
        <label class="block font-bold" htmlFor="title">
          Title
        </label>
        <input
          class="bg-slate-800 w-3/5 max-w-prose"
          name="title"
          value={title}
          onChange={(e) => setTitle((e.target as HTMLInputElement).value)}
        />
      </div>
      <div>
        <label class="block font-bold" htmlFor="content">
          Content
        </label>
        <textarea
          class="bg-slate-800 w-3/5 max-w-prose"
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
    </div>
  );
};
export default PostDialog;
