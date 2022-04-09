import { FunctionalComponent, h } from "preact";
import { ListBox } from "./ListBox";
import { OnChangeProps, Visibility } from "../../types/types";

const VisibilitySelect = ({ value, onChange }: OnChangeProps<Visibility>) => {
  return (
    <ListBox value={value} onChange={onChange}>
      <ListBox.Button>{value}</ListBox.Button>
      <ListBox.Options>
        {Object.entries(Visibility).map(([_, value]) => (
          <ListBox.Option key={value} value={value}>
            {value}
          </ListBox.Option>
        ))}
      </ListBox.Options>
    </ListBox>
  );
};

export default VisibilitySelect;
