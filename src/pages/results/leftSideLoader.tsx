import React from "react";
import ContentLoader from "react-content-loader";

const LeftSideLoader = () => (
  <ContentLoader
    speed={0.8}
    width={600}
    height={800}
    viewBox="0 0 600 800"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
  >
    <rect rx="0" ry="0" width="570" height="753" />
  </ContentLoader>
);

export default LeftSideLoader;
