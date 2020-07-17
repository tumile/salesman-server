import L from "leaflet";
import PropTypes from "prop-types";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { Map as LeafletMap, Marker, Popup, TileLayer } from "react-leaflet";
import "./Map.css";
import Icon from "./Icon";

class MainMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      city: null,
    };
  }

  async componentDidMount() {
    let { city } = this.props.player;
    city = await fetch(`/api/cities/${city}`).then((res) => res.json());
    this.setState({ city });
  }

  render() {
    const { city } = this.state;
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
            html: ReactDOMServer.renderToString(<Icon avatar src={this.props.player.image} />),
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
};

export default MainMap;
