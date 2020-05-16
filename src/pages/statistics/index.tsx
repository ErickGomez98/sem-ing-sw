import {
  CarOutlined,
  ClockCircleOutlined,
  DashboardOutlined,
  EllipsisOutlined,
  EnvironmentOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { Card, Col, Row, Statistic } from "antd";
import Title from "antd/lib/typography/Title";
import Axios from "axios";
import React, { useEffect, useState } from "react";
import ReactMapboxGl, { MapContext } from "react-mapbox-gl";
import { Redirect } from "react-router-dom";
import Layout from "../../components/Layout";
import { Statistics as IStatistics } from "../../interfaces";
const BACKEND_API = "http://localhost:3001/";

const Map = ReactMapboxGl({
  accessToken: process.env.REACT_APP_MAPBOX_API as string | "noApi",
});

const Statistics: React.FC<{}> = () => {
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  const [statistics, setStatistics] = useState<IStatistics>({
    totalRoutes: 0,
    averageCarConsumption: 0,
    averageDistance: 0,
    averageDuration: 0,
    averageRideConsumption: 0,
    mostUsedCar: {
      car: { marca: "", modelo: "", year: { year: 0, rendimientoLitro: 0 } },
      occurrences: 0,
    },
  });
  const [redirectToHome, setRedirectToHome] = useState<boolean>(false);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const { data } = await Axios.get<IStatistics>(
        `${BACKEND_API}routes/statistics`
      );
      setDataLoaded(true);
      setStatistics(data);
    } catch (er) {
      setRedirectToHome(true);
    }
  };

  if (redirectToHome) return <Redirect to="/" />;
  if (!dataLoaded || !statistics) return <h1>loading</h1>;
  return (
    <Layout
      leftComponent={
        <Map
          // eslint-disable-next-line
          style="mapbox://styles/mapbox/streets-v11"
          zoom={[16.3]}
          pitch={[45]}
          center={[-103.324737, 20.656951]}
          bearing={[-17.6]}
          containerStyle={{
            height: "100vh",
            width: "100%",
          }}
        >
          <MapContext.Consumer>
            {(map) => {
              function rotateCamera(timestamp: number) {
                // clamp the rotation between 0 -360 degrees
                // Divide timestamp by 100 to slow rotation to ~10 degrees / sec
                map.rotateTo((timestamp / 100) % 360, { duration: 0 });
                // Request the next frame of the animation.
                //@ts-ignore
                requestAnimationFrame(rotateCamera);
              }
              rotateCamera(0);

              var layers = map.getStyle().layers;

              var labelLayerId;
              for (var i = 0; i < layers.length; i++) {
                if (
                  layers[i].type === "symbol" &&
                  layers[i].layout["text-field"]
                ) {
                  labelLayerId = layers[i].id;
                  break;
                }
              }
              map.addLayer(
                {
                  id: "3d-buildings",
                  source: "composite",
                  "source-layer": "building",
                  filter: ["==", "extrude", "true"],
                  type: "fill-extrusion",
                  minzoom: 15,
                  paint: {
                    "fill-extrusion-color": "#aaa",

                    // use an 'interpolate' expression to add a smooth transition effect to the
                    // buildings as the user zooms in
                    "fill-extrusion-height": [
                      "interpolate",
                      ["linear"],
                      ["zoom"],
                      15,
                      0,
                      15.05,
                      ["get", "height"],
                    ],
                    "fill-extrusion-base": [
                      "interpolate",
                      ["linear"],
                      ["zoom"],
                      15,
                      0,
                      15.05,
                      ["get", "min_height"],
                    ],
                    "fill-extrusion-opacity": 0.6,
                  },
                },
                labelLayerId
              );

              map.scrollZoom.disable();
              map.dragPan.disable();
              map.dragRotate.disable();
              return "";
            }}
          </MapContext.Consumer>
        </Map>
      }
      rightComponent={
        <div className="site-statistic-demo-card">
          <Row gutter={16} justify="center" style={{ marginTop: "10%" }}>
            <div style={{ textAlign: "center" }}>
              <Title>Estadísticas</Title>
              <p className="secondaryText">
                Información relevante sobre las rutas generadas
              </p>
            </div>
          </Row>
          <Row gutter={16} justify="center" style={{ marginTop: "10%" }}>
            <Col span={12}>
              <Card>
                <Statistic
                  title="Total rutas generadas"
                  value={statistics.totalRoutes}
                  prefix={<EnvironmentOutlined />}
                />
              </Card>
            </Col>
            <Col span={12}>
              <Card>
                <Statistic
                  title="Consumo de combustible promedio de automóviles"
                  value={statistics.averageCarConsumption}
                  precision={2}
                  prefix={<DashboardOutlined />}
                  suffix="litros"
                />
              </Card>
            </Col>
          </Row>
          <Row gutter={16} justify="center" style={{ marginTop: "10%" }}>
            <Col span={12}>
              <Card>
                <Statistic
                  title="Consumo de combustible promedio por viaje"
                  value={statistics.averageRideConsumption}
                  precision={2}
                  prefix={<MoreOutlined />}
                  suffix="litros"
                />
              </Card>
            </Col>
            <Col span={12}>
              <Card>
                <Statistic
                  title="Automóvil más utilizado"
                  value={`${statistics.mostUsedCar.car.modelo} ${statistics.mostUsedCar.car.year.year} - ${statistics.mostUsedCar.car.year.rendimientoLitro} km/l`}
                  prefix={<CarOutlined />}
                />
              </Card>
            </Col>
          </Row>
          <Row gutter={16} style={{ marginTop: 100 }} justify="center">
            <Col span={12}>
              <Card>
                <Statistic
                  title="Distancia promedio por viaje"
                  value={statistics.averageDistance}
                  precision={2}
                  prefix={<EllipsisOutlined />}
                  suffix="kilómetros"
                />
              </Card>
            </Col>
            <Col span={12}>
              <Card>
                <Statistic
                  title="Duración promedio por viaje"
                  value={statistics.averageDuration}
                  prefix={<ClockCircleOutlined />}
                  precision={0}
                  suffix="minutos"
                />
              </Card>
            </Col>
          </Row>
        </div>
      }
    />
  );
};

export default Statistics;
