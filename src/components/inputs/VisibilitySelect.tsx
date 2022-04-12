import { h } from "preact";
import { ListBox } from "./ListBox";
import { OnChangeProps, Visibility } from "src/types/types";

const VISIBILITY_TO_DISPLAYABLE = {
  [Visibility.NORMAL]: "Normal",
  [Visibility.HIDDEN]: "Hidden",
};

const VisibilitySelect = ({ value, onChange }: OnChangeProps<Visibility>) => {
  return (
    <ListBox value={value} onChange={onChange}>
      <ListBox.Button>{VISIBILITY_TO_DISPLAYABLE[value]}</ListBox.Button>
      <ListBox.Options>
        {Object.entries(Visibility).map(([_, value]) => (
          <ListBox.Option key={value} value={value}>
            {VISIBILITY_TO_DISPLAYABLE[value]}
          </ListBox.Option>
        ))}
      </ListBox.Options>
    </ListBox>
  );
};

export default VisibilitySelect;
