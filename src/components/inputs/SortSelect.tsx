import { cloneElement, h } from "preact";
import { ListBox } from "src/components/inputs/ListBox";
import { OnChangeProps, Stylable } from "src/types/types";
import { CalendarIcon, ChartBarIcon, ChatIcon } from "@heroicons/react/solid";
import { Children } from "preact/compat";

export enum SortBy {
  MOST_POPULAR = "Most popular",
  MOST_RECENT = "Most recent",
}

const SORT_BY_TO_ICON = {
  [SortBy.MOST_RECENT]: <CalendarIcon width={25} height={25} />,
  [SortBy.MOST_POPULAR]: <ChartBarIcon width={25} height={25} />,
};

type Props = OnChangeProps<SortBy> & Stylable;

const SortSelect = ({ value, onChange, className }: Props) => {
  return (
    <ListBox value={value} onChange={onChange} className={className}>
      <ListBox.Button>
        {cloneElement(SORT_BY_TO_ICON[value], {
          width: 25,
          height: 25,
          className: "inline",
        })}{" "}
        {value}
      </ListBox.Button>
      <ListBox.Options>
        {Object.entries(SORT_BY_TO_ICON).map(([sortBy, icon]) => (
          <ListBox.Option key={sortBy} value={sortBy}>
            {icon} {sortBy}
          </ListBox.Option>
        ))}
      </ListBox.Options>
    </ListBox>
  );
};

export default SortSelect;
