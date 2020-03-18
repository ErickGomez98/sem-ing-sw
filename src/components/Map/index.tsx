import React, { useEffect, useState } from "react";

interface Props {
  center: { lat: number; lng: number };
  zoom: number;
  apikey: string;
}
const Map: React.FC<Props> = props => {
  const [platform, setPlatform] = useState();
  const [map, setMap] = useState();

  useEffect(() => {
    //@ts-ignore
    const p = new window.H.service.Platform(props);
    const layer = p.createDefaultLayers();
    const container = document.getElementById("here-map");
    //@ts-ignore
    const m = new window.H.Map(container, layer.vector.normal.map, {
      center: props.center,
      zoom: props.zoom
    });
  }, []);
  return (
    <div
      id="here-map"
      style={{ width: "100%", height: "400px", background: "grey" }}
    />
  );
};

export default Map;
