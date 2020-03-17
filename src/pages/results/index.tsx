import React from "react";
import Layout from "../../components/Layout";

const Results: React.FC<{}> = () => {
  return (
    <Layout
      leftComponent={"results left side"}
      rightComponent={"results right side"}
    />
  );
};

export default Results;
