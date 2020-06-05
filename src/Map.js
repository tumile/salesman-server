import React, { useState } from "react";
import { Map as LeafletMap, Marker, Popup, TileLayer } from "react-leaflet";

export default function Map() {
  const [position, setPosition] = useState([48.8566, 2.3522]);

  return (
    <LeafletMap
      center={position}
      zoom={5}
      maxZoom={6}
      minZoom={5}
      zoomControl={false}
    >
      <TileLayer
        attribution="©OpenStreetMap, ©CartoDB"
        url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>Here you are!</Popup>
      </Marker>
    </LeafletMap>
  );
}
