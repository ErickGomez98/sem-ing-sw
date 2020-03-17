import React from "react";
import Layout from "../../components/Layout";
import "./home.css";
import HomeForm from "./form";

const Home: React.FC<{}> = () => {
  return (
    <Layout
      leftComponent={<div className="homeLeftSideBackground" />}
      rightComponent={<HomeForm />}
    />
  );
};

export default Home;
