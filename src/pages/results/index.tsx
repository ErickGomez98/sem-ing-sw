import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { useParams, Redirect } from "react-router-dom";
import ReactMapboxGl, { GeoJSONLayer } from "react-mapbox-gl";
import { Center } from "../../interfaces";
import { Row, Col } from "antd";
import Accordion from "../../components/Accordion";
import MapRouteItem, { Step } from "../../components/Accordion/MapRoute";
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

  /**
   * Función utilizada para mostrar la ruta seleccionada en el mapa.
   * @param key
   */
  const updateSelectedRoute = (key: number) => {
    if (!isNaN(key)) {
      setSelectedRoute(routes[key]);
      setCurrentFitBounds([
        [
          selectedRoute.geometry.coordinates[0][0],
          selectedRoute.geometry.coordinates[0][1]
        ],
        [
          selectedRoute.geometry.coordinates[
            selectedRoute.geometry.coordinates.length - 1
          ][0],
          selectedRoute.geometry.coordinates[
            selectedRoute.geometry.coordinates.length - 1
          ][1]
        ]
      ]);
    }
  };

  /**
   * Mueve el mapa a una posición en especifica, a una step de la ruta.
   * @param l
   */
  const updateHoverStep = (l: Center) => {
    console.log("location", l);
    setCurrentFitBounds([l, l]);
    setMaxZoom(15);
  };

  /**
   * Función para resetear la vista después de que se quita el hover
   * de un step, deberá de reiniciar la vista a la ruta activa.
   */
  const resetHoverStep = () => {
    setCurrentFitBounds([
      [
        selectedRoute.geometry.coordinates[0][0],
        selectedRoute.geometry.coordinates[0][1]
      ],
      [
        selectedRoute.geometry.coordinates[
          selectedRoute.geometry.coordinates.length - 1
        ][0],
        selectedRoute.geometry.coordinates[
          selectedRoute.geometry.coordinates.length - 1
        ][1]
      ]
    ]);
    setMaxZoom(20);
  };

  /**
   * Función para filtrar los steps y eliminar los "repetidos"
   * @param route
   */
  const getSteps = (route: any): Step[] => {
    let arr: any = [];
    let filtered: any = [];
    arr = route.legs[0].steps.map((step: any, k: number) => {
      return {
        name: step.name,
        type: step.maneuver.type,
        modifier: step.maneuver.modifier,
        instruction: step.maneuver.instruction,
        location: step.maneuver.location
      };
    });

    arr.map((i: any) => {
      if (!filtered.find((j: any) => j.name === i.name)) filtered.push(i);
    });

    return filtered;
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
                  content: (
                    <MapRouteItem
                      changeOnHover={l => updateHoverStep(l)}
                      resetOnLeave={resetHoverStep}
                      steps={getSteps(route)}
                    />
                  )
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
