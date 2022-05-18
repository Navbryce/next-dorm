import { useEffect, useState } from "preact/compat";
import { Community, CommunityPosInTree } from "../types/types";
import { genLinkToCommunity, URLS } from "../urls";
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
  const [namesAndPaths, setNamesAndURLs] =
    useState<{ name: string; url: string }[]>();

  useEffect(() => {
    if (!pos) {
      return;
    }
    setNamesAndURLs(pos.children.map(communityToNameAndURL));
  }, [pos]);
  return (
    <div className="w-4/5 mt-5">
      <div className="flex">
        <a href={genLinkToCommunity(pos?.path[-1] ?? ALL_COMMUNITY)}>
          <IconButton
            buttonType="text"
            startIcon={<ArrowUpIcon />}
            disabled={current == ALL_COMMUNITY}
            tooltip={{ contents: "Previous community" }}
          />
        </a>
        <a href={URLS.pages.feed}>
          <IconButton
            buttonType="text"
            startIcon={<HomeIcon />}
            tooltip={{ contents: "Your feed" }}
          />
        </a>
        <a href={genLinkToCommunity(ALL_COMMUNITY)}>
          <IconButton
            buttonType="text"
            startIcon={<CollectionIcon />}
            tooltip={{ contents: "All" }}
          />
        </a>
      </div>
      <div className="relative top-[-8px]">
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
            No child communities
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunitiesList;
