import React from "react";
import { Map as LeafletMap, TileLayer } from "react-leaflet";
import "./Map.css";
import PlayerMarker from "./PlayerMarker";
import PointMarker from "./PointMarker";

class MainMap extends React.Component {
  async componentDidMount() {
    await this.props.getCity();
  }

  render() {
    const { player, city } = this.props;
    if (!city) {
      return null;
    }
    return (
      <LeafletMap
        className="main-map"
        center={[city.latitude, city.longitude]}
        zoom={15}
        minZoom={14}
        maxZoom={15}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"
          attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors &copy; <a href='https://carto.com/attributions'>CARTO</a>"
        />
        <PlayerMarker player={player} city={city} />
        {city.pointsOfInterest.map((point) => (
          <PointMarker key={point.id} point={point} />
        ))}
      </LeafletMap>
    );
  }
}

export default MainMap;
