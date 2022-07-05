import { withStandardPageElements } from "src/components/StdLayout";

const AboutScreen = () => {
  return (
    <div>
      <h1>Welcome to NextDorm!</h1>
      <p>
        The goal of this site is to enable on-campus complaining by providing a
        localized-way to target discussions.
      </p>
      <p>
        The website is basically a reddit-clone with hierarchical communities
        and the ability to post anonymously.
      </p>
      <p>
        If you want a community added,{" "}
        <a className="link" href="https://github.com/Navbryce/next-dorm">
          create an issue on Github
        </a>
      </p>
    </div>
  );
};

export default withStandardPageElements(AboutScreen);
