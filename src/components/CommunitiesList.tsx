import { FunctionalComponent, h } from "preact";
import { useEffect, useState } from "preact/compat";
import { Community, CommunityPosInTree } from "../types/types";
import { genLinkToCommunity } from "../urls";
import {
  ArrowUpIcon,
  ExclamationCircleIcon,
  HomeIcon,
} from "@heroicons/react/solid";
import { IconButton } from "src/components/inputs/Button";
import { CollectionIcon } from "@heroicons/react/outline";
import { ALL_COMMUNITY } from "src/model/community";

type Props = {
  current?: Community;
  pos?: CommunityPosInTree;
};

function communityToNameAndURL(community: Community) {
  return {
    name: community.name,
    url: genLinkToCommunity(community),
  };
}

const CommunitiesList = ({ pos, current }: Props) => {
  // TODO: Change to only show child communities
  const [namesAndPaths, setNamesAndURLs] = useState<
    { name: string; url: string }[]
  >([]);

  useEffect(() => {
    if (!pos) {
      return;
    }
    setNamesAndURLs(pos.children.map(communityToNameAndURL));
  }, [pos]);

  return (
    <div>
      <div className="space-x-2">
        <a href={genLinkToCommunity(pos?.path[-1] ?? ALL_COMMUNITY)}>
          <IconButton buttonType="text" startIcon={<ArrowUpIcon />} />
        </a>
        <a href="/">
          <IconButton buttonType="text" startIcon={<HomeIcon />} />
        </a>
        <a href={genLinkToCommunity(ALL_COMMUNITY)}>
          <IconButton buttonType="text" startIcon={<CollectionIcon />} />
        </a>
      </div>
      <div className="border-b border-secondary-100 w-4/5" />
      {namesAndPaths &&
        namesAndPaths.map(({ name, url }) => (
          <div key={name}>
            <a
              href={url}
              class="
      block border-l pl-4 -ml-px border-transparent hover:border-slate-400 dark:hover:border-slate-500 text-slate-700 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300
      "
            >
              <h2>{name}</h2>
            </a>
          </div>
        ))}
      {namesAndPaths && namesAndPaths.length == 0 && (
        <div className="flex items-center">
          <ExclamationCircleIcon width={25} height={25} className="inline" />
          No children
        </div>
      )}
    </div>
  );
};

export default CommunitiesList;
