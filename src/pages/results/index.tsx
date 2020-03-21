import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { useParams, Redirect } from "react-router-dom";
import ReactMapboxGl, { GeoJSONLayer } from "react-mapbox-gl";
import { Center } from "../../interfaces";
import { Row, Col } from "antd";
import Accordion from "../../components/Accordion";
const Map = ReactMapboxGl({
  accessToken: process.env.REACT_APP_MAPBOX_API as string | "noApi"
});

const Results: React.FC<{ location: any }> = props => {
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  const [redirectToHome, setRedirectToHome] = useState<boolean>(false);
  const [routes, setRoutes] = useState<any>();
  const [selectedRoute, setSelectedRoute] = useState<any>();
  const [currentFitBounds, setCurrentFitBounds] = useState<[Center, Center]>();
  const [maxZoom, setMaxZoom] = useState<number>(20);

  // El ID que se pasa por los params
  let { id } = useParams();

  useEffect(() => {
    // En base al ID, consultar el backend.
    // setTimeout(() => {
    //   setDataLoaded(true);
    // }, 1500);

    // Solamente en esta etapa de prototipo se deberá sacar la info
    // desde los props, una vez implementado el back, quitar los props
    // ya que la info se sacará del back y no de props.
    if (!props.location.state) {
      setRedirectToHome(true);
    } else {
      const currentRoute = props.location.state.routes[0];
      setRoutes(props.location.state.routes);
      setSelectedRoute(currentRoute);
      setDataLoaded(true);
      setCurrentFitBounds([
        [
          currentRoute.geometry.coordinates[0][0],
          currentRoute.geometry.coordinates[0][1]
        ],
        [
          currentRoute.geometry.coordinates[
            currentRoute.geometry.coordinates.length - 1
          ][0],
          currentRoute.geometry.coordinates[
            currentRoute.geometry.coordinates.length - 1
          ][1]
        ]
      ]);
      console.log(props.location.state.routes[0]);
    }
  }, []);

  const updateSelectedRoute = (key: number) => {
    setSelectedRoute(routes[key]);
  };

  if (redirectToHome) return <Redirect to="/" />;

  if (!dataLoaded) return <h1>loading</h1>;

  return (
    <Layout
      leftComponent={
        <Map
          style="mapbox://styles/mapbox/streets-v9"
          containerStyle={{
            height: "100vh",
            width: "100%"
          }}
          fitBounds={currentFitBounds}
          fitBoundsOptions={{
            easing: t =>
              t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t,
            padding: 50,
            maxZoom
          }}
        >
          <GeoJSONLayer
            data={selectedRoute.geometry}
            linePaint={{
              "line-color": "red",
              "line-width": 5,
              "line-blur": 1,
              "line-opacity": 0.7
            }}
            lineLayout={{
              "line-cap": "round"
            }}
          />
        </Map>
      }
      rightComponent={
        <Row justify="center">
          <Col span={22}>
            <Accordion
              onClick={key => updateSelectedRoute(+key)}
              panels={routes.map((route: any, v: number) => {
                return {
                  title: `Alternativa ${v + 1}`,
                  content: route.legs[0].summary
                };
              })}
            />
          </Col>
        </Row>
      }
    />
  );
};

export default Results;
