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
import { Row, Col, Statistic, Typography, Divider } from "antd";
import Accordion from "../../components/Accordion";
import MapRouteItem, { Step } from "../../components/Accordion/MapRoute";
import axios from "axios";

const BACKEND_API = "http://localhost:3001/";
const Map = ReactMapboxGl({
  accessToken: process.env.REACT_APP_MAPBOX_API as string | "noApi",
});

const { Title, Text } = Typography;

export enum ERouteColor {
  GREEN = "#52c41a",
  BLUE = "#1890ff",
  RED = "#ff4d4f",
}

const Results: React.FC<{ location: any }> = (props) => {
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  const [redirectToHome, setRedirectToHome] = useState<boolean>(false);
  const [routes, setRoutes] = useState<any>();
  const [selectedRoute, setSelectedRoute] = useState<any>();
  const [selectedRouteColor, setSelectedRouteColor] = useState<ERouteColor>(
    ERouteColor.GREEN
  );
  const [currentFitBounds, setCurrentFitBounds] = useState<[Center, Center]>();
  const [maxZoom, setMaxZoom] = useState<number>(20);
  const [routeInfo, setRouteInfo] = useState<any>();

  // El ID que se pasa por los params
  let { id } = useParams();

  useEffect(() => {
    fetchResult();
  }, []);

  const fetchResult = async () => {
    const { data } = await axios.get(`${BACKEND_API}routes/results/${id}`);
    setRouteInfo(data);

    const currentRoute = data.routes[0];
    setRoutes(data.routes);
    setSelectedRoute(currentRoute);
    setSelectedRouteColor(ERouteColor.GREEN);
    setDataLoaded(true);
    console.log(currentRoute);
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
    setRouteInfo(data);
  };

  /**
   * Función utilizada para mostrar la ruta seleccionada en el mapa.
   * @param key
   */
  const updateSelectedRoute = (key: number) => {
    if (!isNaN(key)) {
      setSelectedRoute(routes[key]);
      if (key === 0) {
        setSelectedRouteColor(ERouteColor.GREEN);
      } else if (key === routes.length - 1) {
        setSelectedRouteColor(ERouteColor.RED);
      } else {
        setSelectedRouteColor(ERouteColor.BLUE);
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

  /**
   * Formatea una duración para regresar ya sea minutos u horas
   * @param d {number} Duración total del viaje
   */
  const formatDuration = (d: number): string => {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor((d % 3600) / 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " hora, " : " horas, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minuto, " : " minutos, ") : "";
    return hDisplay + mDisplay;
  };

  /**
   * Formatea una distancia en metros para regresar ya sea metros o kilometros
   * @param distance {number} Distancia en metros
   */
  const formatDistance = (distance: number): string => {
    return distance > 1000
      ? (distance / 1000).toFixed(2) + " km"
      : distance + " metros";
  };

  /**
   * Calcula cual será el consumo de combustible por recorrer X distancia
   * @param distance {number} Distancia en metros
   * @param kmL {number} kilometros que gasta por litro de combustible
   */
  const calculateUsoCombustible = (distance: number, kmL: number): number => {
    return +(distance / 1000 / kmL).toFixed(2);
  };

  if (redirectToHome) return <Redirect to="/" />;
  if (!dataLoaded || !currentFitBounds) return <h1>loading</h1>;

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
        <Row justify="center" style={{ paddingTop: "20px" }}>
          <Col span={22}>
            <Title style={{ textAlign: "center" }} level={2}>
              Rutas optimizadas
            </Title>
          </Col>
          <Col span={11}>
            <Statistic
              title="Inicio"
              value={routeInfo.startingPoint.placeName}
            />
          </Col>
          <Col span={11}>
            <Statistic
              title="Destino"
              value={routeInfo.destination.placeName}
            />
          </Col>

          <Col span={22} style={{ marginTop: 20 }}>
            <Text>
              Auto <br />
              <b>
                {routeInfo.car.marca +
                  " " +
                  routeInfo.car.modelo +
                  " - " +
                  routeInfo.car.year.year +
                  " (" +
                  routeInfo.car.year.rendimientoLitro +
                  " km/lt)"}
              </b>
            </Text>
            <Divider />
          </Col>

          <Col span={22} style={{ marginTop: "1rem" }}>
            <Accordion
              onClick={(key) => updateSelectedRoute(+key)}
              panels={routes.map((route: any, v: number) => {
                return {
                  title: `Alternativa ${v + 1}, recorre ${formatDistance(
                    route.legs[0].distance
                  )} en ${formatDuration(
                    route.legs[0].duration
                  )} usando ${calculateUsoCombustible(
                    route.legs[0].distance,
                    routeInfo.car.year.rendimientoLitro
                  )} litros de combustible`,
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
