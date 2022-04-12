import { FunctionalComponent, h } from "preact";
import { useEffect, useState } from "preact/compat";
import { Community } from "../types/types";
import { getCommunities } from "../actions/Community";
import { genLinkToCommunity, URLS } from "../urls";

const CommunitiesList = () => {
  // TODO: Change to only show child communities
  const [communities, setCommunities] = useState<Community[]>();

  useEffect(() => {
    getCommunities().then((communities) =>
      setCommunities([
        {
          id: -1,
          name: "All",
        },
        ...communities,
      ])
    );
  }, []);

  return (
    <div>
      {communities &&
        communities.map((community) => (
          <div key={community.id}>
            <a
              href={genLinkToCommunity(community)}
              class="
      block border-l pl-4 -ml-px border-transparent hover:border-slate-400 dark:hover:border-slate-500 text-slate-700 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300
      "
            >
              <h2>{community.name}</h2>
            </a>
          </div>
        ))}
    </div>
  );
};

export default CommunitiesList;
