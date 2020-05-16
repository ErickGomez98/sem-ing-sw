import React from "react";
import ReactMapboxGl, { MapContext } from "react-mapbox-gl";
import Layout from "../../components/Layout";
import HomeForm from "./form";
import "./home.css";
const Map = ReactMapboxGl({
  accessToken: process.env.REACT_APP_MAPBOX_API as string | "noApi",
});

const Home: React.FC<{}> = () => {
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
      rightComponent={<HomeForm />}
    />
  );
};

export default Home;
