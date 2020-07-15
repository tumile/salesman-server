import L from "leaflet";
import PropTypes from "prop-types";
import React from "react";
import { Map as LeafletMap, Marker, TileLayer } from "react-leaflet";
import { connect } from "react-redux";

const WorldMap = (props) => {
  const { player } = props;

  return (
    <LeafletMap center={player.position} zoom={5} minZoom={5} maxZoom={5} zoomControl={false}>
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"
        attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors &copy; <a href='https://carto.com/attributions'>CARTO</a>"
      />
      <Marker
        position={player.position}
        icon={L.icon({
          iconUrl: "images/player/salesman.png",
          iconSize: [30],
          iconAnchor: [15, 100],
        })}
      />
    </LeafletMap>
  );
};

WorldMap.propTypes = {
  player: PropTypes.objectOf(PropTypes.string).isRequired,
};

export default connect(({ player }) => ({ player }))(WorldMap);
