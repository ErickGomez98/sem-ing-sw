import React, { useEffect, useState } from "react";
const mapboxgl = require("mapbox-gl/dist/mapbox-gl.js");
interface Props {
  center: { lat: number; lng: number };
  zoom: number;
  apikey: string;
}
const Map: React.FC<Props> = props => {
  const [platform, setPlatform] = useState();
  const [map, setMap] = useState();

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoiZXJpY2tnb21lejk4IiwiYSI6ImNrMmk3a2x1eDBmdDczY21ydHExeXI5OWUifQ.n5YphkJrn7fAs3EBIazyDA";

    const map = new mapboxgl.Map({
      container: "here-map",
      center: props.center,
      zoom: props.zoom,
      style: "mapbox://styles/mapbox/dark-v10",
      pitch: 45,
      bearing: -17.6,
      antialias: true
    });
    map.addControl(new mapboxgl.NavigationControl());
    map.on("load", function() {
      // Insert the layer beneath any symbol layer.
      var layers = map.getStyle().layers;

      var labelLayerId;
      for (var i = 0; i < layers.length; i++) {
        if (layers[i].type === "symbol" && layers[i].layout["text-field"]) {
          labelLayerId = layers[i].id;
          break;
        }
      }

      alert(1);

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
              ["get", "height"]
            ],
            "fill-extrusion-base": [
              "interpolate",
              ["linear"],
              ["zoom"],
              15,
              0,
              15.05,
              ["get", "min_height"]
            ],
            "fill-extrusion-opacity": 0.6
          }
        },
        labelLayerId
      );
    });
  }, []);
  return (
    <div
      id="here-map"
      style={{ width: "100%", height: "100vh", background: "grey" }}
    />
  );
};

export default Map;
