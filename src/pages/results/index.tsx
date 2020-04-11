import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { useParams, Redirect } from "react-router-dom";
import ReactMapboxGl, {
  GeoJSONLayer,
  Layer,
  Feature,
  Image,
} from "react-mapbox-gl";
import { Center } from "../../interfaces";
import { Row, Col } from "antd";
import Accordion from "../../components/Accordion";
import MapRouteItem, { Step } from "../../components/Accordion/MapRoute";
const Map = ReactMapboxGl({
  accessToken: process.env.REACT_APP_MAPBOX_API as string | "noApi",
});

export type IRouteColor = "red" | "green" | "blue";

const Results: React.FC<{ location: any }> = (props) => {
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  const [redirectToHome, setRedirectToHome] = useState<boolean>(false);
  const [routes, setRoutes] = useState<any>();
  const [selectedRoute, setSelectedRoute] = useState<any>();
  const [selectedRouteColor, setSelectedRouteColor] = useState<IRouteColor>(
    "green"
  );
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
      setSelectedRouteColor("green");
      setDataLoaded(true);
      setCurrentFitBounds([
        [
          currentRoute.geometry.coordinates[0][0],
          currentRoute.geometry.coordinates[0][1],
        ],
        [
          currentRoute.geometry.coordinates[
            currentRoute.geometry.coordinates.length - 1
          ][0],
          currentRoute.geometry.coordinates[
            currentRoute.geometry.coordinates.length - 1
          ][1],
        ],
      ]);
      console.log(props.location.state.routes[0]);

      console.log("roueinfo", props.location.state.routeInfo);
    }
  }, []);

  /**
   * Función utilizada para mostrar la ruta seleccionada en el mapa.
   * @param key
   */
  const updateSelectedRoute = (key: number) => {
    if (!isNaN(key)) {
      setSelectedRoute(routes[key]);
      if (key === 0) {
        setSelectedRouteColor("green");
      } else if (key === routes.length - 1) {
        setSelectedRouteColor("red");
      } else {
        setSelectedRouteColor("blue");
      }
      setCurrentFitBounds([
        [
          selectedRoute.geometry.coordinates[0][0],
          selectedRoute.geometry.coordinates[0][1],
        ],
        [
          selectedRoute.geometry.coordinates[
            selectedRoute.geometry.coordinates.length - 1
          ][0],
          selectedRoute.geometry.coordinates[
            selectedRoute.geometry.coordinates.length - 1
          ][1],
        ],
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
        selectedRoute.geometry.coordinates[0][1],
      ],
      [
        selectedRoute.geometry.coordinates[
          selectedRoute.geometry.coordinates.length - 1
        ][0],
        selectedRoute.geometry.coordinates[
          selectedRoute.geometry.coordinates.length - 1
        ][1],
      ],
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
        location: step.maneuver.location,
      };
    });

    arr.map((i: any) => {
      if (!filtered.find((j: any) => j.instruction === i.instruction))
        filtered.push(i);
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
            width: "100%",
          }}
          fitBounds={currentFitBounds}
          fitBoundsOptions={{
            easing: (t) =>
              t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t,
            padding: 50,
            maxZoom,
          }}
        >
          <GeoJSONLayer
            data={selectedRoute.geometry}
            linePaint={{
              "line-color": selectedRouteColor,
              "line-width": 5,
              "line-blur": 1,
              "line-opacity": 0.7,
            }}
            lineLayout={{
              "line-cap": "round",
            }}
          />
          <Image
            id={"departure-icon"}
            url={
              "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Car_with_Driver-Silhouette.svg/1200px-Car_with_Driver-Silhouette.svg.png"
            }
          />
          <Image
            id={"arrival-icon"}
            url={"https://cdn.onlinewebfonts.com/svg/img_513606.png"}
          />
          <Layer
            type="symbol"
            layout={{ "icon-image": "departure-icon", "icon-size": 0.02 }}
          >
            <Feature
              coordinates={[
                selectedRoute.geometry.coordinates[0][0],
                selectedRoute.geometry.coordinates[0][1],
              ]}
            />
          </Layer>
          <Layer
            type="symbol"
            layout={{ "icon-image": "arrival-icon", "icon-size": 0.02 }}
          >
            <Feature
              coordinates={[
                selectedRoute.geometry.coordinates[
                  selectedRoute.geometry.coordinates.length - 1
                ][0],
                selectedRoute.geometry.coordinates[
                  selectedRoute.geometry.coordinates.length - 1
                ][1],
              ]}
            />
          </Layer>
        </Map>
      }
      rightComponent={
        <Row justify="center">
          <Col span={22}></Col>
          <Col span={22}>
            <Accordion
              onClick={(key) => updateSelectedRoute(+key)}
              panels={routes.map((route: any, v: number) => {
                return {
                  title: `Alternativa ${v + 1}`,
                  content: (
                    <MapRouteItem
                      changeOnHover={(l) => updateHoverStep(l)}
                      resetOnLeave={resetHoverStep}
                      steps={getSteps(route)}
                    />
                  ),
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
