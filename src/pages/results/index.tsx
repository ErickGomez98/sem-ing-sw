import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { useParams } from "react-router-dom";
import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl";
const Map = ReactMapboxGl({
  accessToken: process.env.REACT_APP_MAPBOX_API as string | "noApi"
});

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
        <Map
          style="mapbox://styles/mapbox/streets-v9"
          zoom={[15.5]}
          pitch={[45]}
          bearing={[-17.6]}
          containerStyle={{
            height: "100vh",
            width: "100%"
          }}
        ></Map>
      }
      rightComponent={"<RightSideLoader />"}
    />
  );
};

export default Results;
