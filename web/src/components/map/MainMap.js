import L from "leaflet";
import PropTypes from "prop-types";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { Map as LeafletMap, Marker, Popup, TileLayer } from "react-leaflet";
import Icon from "./Icon";
import "./Map.css";

class MainMap extends React.Component {
  async componentDidMount() {
    await this.props.updateCurrentCity();
  }

  render() {
    const { player, city } = this.props;
    if (!city) {
      return null;
    }
    return (
      <LeafletMap className="main-map" center={city.coords} zoom={15} minZoom={14} maxZoom={15} zoomControl={false}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"
          attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors &copy; <a href='https://carto.com/attributions'>CARTO</a>"
        />
        <Marker
          position={city.coords}
          icon={L.divIcon({
            html: ReactDOMServer.renderToString(<Icon avatar src={player.image} />),
          })}
        />
        {city.pointsOfInterest.map((point) => {
          return (
            <Marker
              key={point.name}
              position={point.coords}
              icon={L.divIcon({
                html: ReactDOMServer.renderToString(<Icon src={point.image} />),
              })}
            >
              <Popup>
                <div className="popup-content">
                  <img src={point.image} alt="Point of interest" />
                  <div className="popup-content-inner">
                    <h5>{point.name}</h5>
                    <p>{point.description}</p>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </LeafletMap>
    );
  }
}

MainMap.propTypes = {
  player: PropTypes.object.isRequired,
  city: PropTypes.object,
  customers: PropTypes.array.isRequired,
  updateCurrentCity: PropTypes.func.isRequired,
};

export default MainMap;
