import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { useParams } from "react-router-dom";
import RightSideLoader from "./rightSideLoader";
import LeftSideLoader from "./leftSideLoader";
// import Map from "../../components/Map";
import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl";
const Map = ReactMapboxGl({
  accessToken:
    "pk.eyJ1IjoiZXJpY2tnb21lejk4IiwiYSI6ImNrMmk3a2x1eDBmdDczY21ydHExeXI5OWUifQ.n5YphkJrn7fAs3EBIazyDA"
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
        >
          <Layer
            type="symbol"
            id="marker"
            layout={{ "icon-image": "marker-15" }}
          >
            <Feature coordinates={[-0.481747846041145, 51.3233379650232]} />
          </Layer>
        </Map>
      }
      rightComponent={"<RightSideLoader />"}
    />
  );
};

export default Results;
