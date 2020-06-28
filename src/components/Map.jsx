import L from "leaflet";
import PropTypes from "prop-types";
import React from "react";
import { Map as LeafletMap, Marker, Popup, TileLayer } from "react-leaflet";
import { connect } from "react-redux";
import { setDestinationCity, showTravelCatalog } from "../state/game";
import Curve from "./Curve";
import "./Map.css";

const Map = (props) => {
  const { customers, cities, currentCity, destinationCity, setDestinationCity, showTravelCatalog } = props;
  const currentCityPosition = cities.find((c) => c.name === currentCity).position;

  const handleFlightSelect = (e, city) => {
    e.preventDefault();
    showTravelCatalog(true);
    setDestinationCity(city);
  };

  const renderPath = () => {
    if (!destinationCity) {
      return null;
    }
    const destCityPosition = cities.find((city) => city.name === destinationCity).position;
    const p = [
      (currentCityPosition[0] + destCityPosition[0]) / 2 + 1,
      (currentCityPosition[1] + destCityPosition[1]) / 2 - 1,
    ];
    return (
      <Curve
        positions={["M", currentCityPosition, "Q", p, destCityPosition]}
        options={{
          dashArray: 10,
          animate: { duration: 30000, iterations: Infinity },
        }}
      />
    );
  };

  return (
    <LeafletMap center={currentCityPosition} zoom={5} maxZoom={6} minZoom={5} zoomControl={false}>
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"
        attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors &copy; <a href='https://carto.com/attributions'>CARTO</a>"
        subdomains="abcd"
      />
      {renderPath()}
      <Marker
        position={currentCityPosition}
        icon={L.icon({ iconUrl: "images/player/salesman.png", iconSize: [38], iconAnchor: [19, 100] })}
      />
      {customers.map((cust) => {
        const city = cities.find((c) => c.name === cust.city);
        return (
          <Marker
            key={cust.name}
            position={city.position}
            icon={L.icon({ iconUrl: cust.image, iconSize: [43], iconAnchor: [20, 100] })}
          >
            <Popup className="leaflet-popup">
              <div className="popup-content" style={{ backgroundImage: `url(${city.image})` }}>
                <div className="row">
                  <div className="col-4">
                    <img src={cust.image} alt="Customer" />
                  </div>
                  <div className="col-8">
                    <div>
                      <a href="#" role="button" onClick={(e) => handleFlightSelect(e, city.name)}>
                        <h6>{city.name}</h6>
                      </a>
                      <p>Hi, I&lsquo;m looking to buy your product for ${cust.offer}.</p>
                    </div>
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
  customers: PropTypes.arrayOf(PropTypes.object).isRequired,
  cities: PropTypes.arrayOf(PropTypes.object).isRequired,
  currentCity: PropTypes.string.isRequired,
  destinationCity: PropTypes.string.isRequired,
  setDestinationCity: PropTypes.func.isRequired,
  showTravelCatalog: PropTypes.func.isRequired,
};

export default connect(
  ({ customers, cities, currentCity, destinationCity }) => ({
    customers,
    cities,
    currentCity,
    destinationCity,
  }),
  { setDestinationCity, showTravelCatalog }
)(Map);
