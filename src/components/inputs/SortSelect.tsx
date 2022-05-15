import { cloneElement, Fragment, h } from "preact";
import { ListBox } from "src/components/inputs/ListBox";
import { OnChangeProps, Since, Stylable } from "src/types/types";
import { CalendarIcon, ChartBarIcon, ChatIcon } from "@heroicons/react/solid";
import { useCallback } from "preact/compat";

type SinceSelectProps = OnChangeProps<Since | null> & Stylable;

function sinceToDisplayStr(since: Since | null): string {
  switch (since) {
    case null:
      return "all";
    case Since.TODAY:
      return "a day ago";
    default:
      throw new Error("Unknown since");
  }
}

const SinceSelect = ({ value, onChange, className }: SinceSelectProps) => {
  return (
    <ListBox value={value} onChange={onChange} className={className}>
      <ListBox.Button>{sinceToDisplayStr(value)}</ListBox.Button>
      <ListBox.Options>
        {[null, ...Object.values(Since)].map((since) => (
          <ListBox.Option key={since} value={since}>
            {sinceToDisplayStr(since)}
          </ListBox.Option>
        ))}
      </ListBox.Options>
    </ListBox>
  );
};

export enum SortBy {
  MOST_POPULAR = "Most popular",
  MOST_RECENT = "Most recent",
}

const SORT_BY_TO_ICON = {
  [SortBy.MOST_RECENT]: <CalendarIcon width={25} height={25} />,
  [SortBy.MOST_POPULAR]: <ChartBarIcon width={25} height={25} />,
};

type SortTypeSelectProps = OnChangeProps<SortBy> & Stylable;

const SortBySelect = ({ value, onChange, className }: SortTypeSelectProps) => {
  return (
    <div className="flex">
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
    </div>
  );
};

export type Sort = { sortBy: SortBy; since?: Since | null };

type Props = OnChangeProps<Sort>;

const SortSelect = ({ value, onChange }: Props) => {
  const onSortBySelect = useCallback(
    (sortBy: SortBy) => {
      onChange({
        sortBy,
        since: sortBy == SortBy.MOST_POPULAR ? value.since : undefined,
      });
    },
    [onChange]
  );
  return (
    <div className="flex items-center space-x-2">
      <SortBySelect value={value.sortBy} onChange={onSortBySelect} />
      {value.sortBy == SortBy.MOST_POPULAR && (
        <Fragment>
          <span>since</span>
          <SinceSelect
            value={value.since ?? null}
            onChange={(val) => onChange({ sortBy: value.sortBy, since: val })}
            className="w-32"
          />
        </Fragment>
      )}
    </div>
  );
};

export default SortSelect;
