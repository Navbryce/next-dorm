import { FunctionalComponent, h } from "preact";
import { Community, CommunityPosInTree } from "src/types/types";
import Breadcrumb, { BreadcrumbItem } from "src/components/Breadcrumb";
import { ALL_COMMUNITY } from "src/model/community";
import { genLinkToCommunity } from "src/urls";

type Props = {
  pos?: CommunityPosInTree;
  current?: Community;
};

const CommunityBreadcrumb = ({ pos, current }: Props) => {
  return (
    <Breadcrumb>
      <BreadcrumbItem>
        <a href={genLinkToCommunity(ALL_COMMUNITY)}>All</a>
      </BreadcrumbItem>
      {pos &&
        pos.children.map((community) => (
          <BreadcrumbItem key={community.id}>
            <a href={genLinkToCommunity(community)}>{community.name}</a>
          </BreadcrumbItem>
        ))}
      {current && (
        <BreadcrumbItem>
          <a href={genLinkToCommunity(current)}>{current.name}</a>
        </BreadcrumbItem>
      )}
    </Breadcrumb>
  );
};

export default CommunityBreadcrumb;
