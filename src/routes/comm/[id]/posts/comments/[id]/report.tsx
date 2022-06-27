import { withAuth } from "src/components/wrappers/Auth";

const ReportCommentScreen = () => {
  return <div />;
};

export default withAuth(ReportCommentScreen, {
  requireProfile: true,
});
