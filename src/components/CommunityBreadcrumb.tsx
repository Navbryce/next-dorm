import { Community, CommunityPosInTree } from "src/types/types";
import Breadcrumb, { BreadcrumbItem } from "src/components/Breadcrumb";
import { genLinkToCommunity } from "src/urls";

type Props = {
  pos?: CommunityPosInTree;
  current?: Community;
};

const CommunityBreadcrumb = ({ pos, current }: Props) => {
  return (
    <Breadcrumb>
      {pos &&
        pos.path.map((community) => (
          <BreadcrumbItem key={community.id}>
            <a href={genLinkToCommunity(community)} className="link">
              {community.name}
            </a>
          </BreadcrumbItem>
        ))}
      {current && (
        <BreadcrumbItem>
          <a href={genLinkToCommunity(current)} className="link">
            {current.name}
          </a>
        </BreadcrumbItem>
      )}
    </Breadcrumb>
  );
};

export default CommunityBreadcrumb;
