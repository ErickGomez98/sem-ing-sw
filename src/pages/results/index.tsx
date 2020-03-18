import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { useParams } from "react-router-dom";
import RightSideLoader from "./rightSideLoader";
import LeftSideLoader from "./leftSideLoader";
import Map from "../../components/Map";

const Results: React.FC<{}> = () => {
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  // El ID que se pasa por los params
  let { id } = useParams();

  useEffect(() => {
    setTimeout(() => {
      setDataLoaded(true);
    }, 1500);
  }, []);
  return (
    <Layout
      leftComponent={
        dataLoaded ? (
          <Map
            apikey="fq363hnpCMkG3N1aKEF2"
            zoom={10}
            center={{
              lat: 52.5,
              lng: 13.4
            }}
          />
        ) : (
          <LeftSideLoader />
        )
      }
      rightComponent={dataLoaded ? "results left side" : <RightSideLoader />}
    />
  );
};

export default Results;
