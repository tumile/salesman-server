import L from "leaflet";
import PropTypes from "prop-types";
import React from "react";
import { Map as LeafletMap, Marker, Popup, TileLayer } from "react-leaflet";
import { connect } from "react-redux";
import Curve from "./Curve";
import "./Map.css";

const Map = (props) => {
  const { position, cities } = props;

  return (
    <LeafletMap center={position} zoom={5} maxZoom={6} minZoom={5} zoomControl={false}>
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"
        attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors &copy; <a href='https://carto.com/attributions'>CARTO</a>"
        subdomains="abcd"
      />
      <Curve
        positions={["M", [52.52, 13.405], "Q", [56.1379, 23.51115], [55.7558, 37.6173]]}
        options={{
          dashArray: 10,
          animate: { duration: 30000, iterations: Infinity },
        }}
      />
      {cities.map((c) => {
        const iconUrl = `images/customer${Math.floor(Math.random() * 11)}.png`;
        return (
          <Marker
            key={c.name}
            position={[c.lat, c.lng]}
            icon={L.icon({ iconUrl, iconSize: [43], iconAnchor: [20, 100] })}
          >
            <Popup className="leaflet-popup">
              <div className="row">
                <div className="col-4">
                  <img src={iconUrl} alt="Customer" />
                </div>
                <div className="col-8">
                  <div>
                    <h6>{c.name}</h6>
                    <p>Hi, I&lsquo;m looking to buy your product for $1000.</p>
                    <p className="text-muted">Offer expired in 05:00:00</p>
                    <button type="button" className="btn btn-primary btn-sm">
                      Flights
                    </button>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </LeafletMap>
  );
};

Map.propTypes = {
  position: PropTypes.arrayOf(PropTypes.number).isRequired,
  cities: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default connect(({ game: { position, cities } }) => ({ position, cities }))(Map);
