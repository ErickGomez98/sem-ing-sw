import React from "react";
import ContentLoader from "react-content-loader";

const RightSideLoader = () => (
  <ContentLoader
    speed={0.8}
    width={600}
    height={800}
    viewBox="0 0 600 800"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
  >
    <rect x="26" y="36" rx="0" ry="0" width="554" height="302" />
    <rect x="26" y="378" rx="0" ry="0" width="554" height="149" />
    <rect x="26" y="577" rx="0" ry="0" width="554" height="149" />
  </ContentLoader>
);

export default RightSideLoader;
