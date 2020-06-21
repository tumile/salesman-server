import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { searchCity, setDestinationCity, travel } from "../state/game";

const TravelCatalog = (props) => {
  const {
    travelCatalogOpen,
    citySearchKey,
    citySearchSuggestions,
    flightInfo,
    flights,
    searchCity,
    setDestinationCity,
    travel,
  } = props;

  if (!travelCatalogOpen) {
    return null;
  }

  const handleBooking = (price) => {
    travel(citySearchKey, price);
  };

  const renderFlightsOrSuggestions = () => {
    if (flights.length > 0) {
      return (
        <div className="catalog-list">
          {flights.map((flight) => (
            <div key={flight.name} className="catalog-list-item">
              <h6>{flight.name}</h6>
              <div className="catalog-list-item-body">
                <span>{`$${flight.price}`}</span>
                <button type="button" className="btn btn-primary btn-sm" onClick={() => handleBooking(flight.price)}>
                  Book
                </button>
              </div>
            </div>
          ))}
        </div>
      );
    }
    if (citySearchSuggestions.length > 0) {
      return (
        <div className="list-group px-3">
          {citySearchSuggestions.map((city) => (
            <button
              key={city}
              type="button"
              className="list-group-item list-group-item-action"
              onClick={() => setDestinationCity(city)}
            >
              {city}
            </button>
          ))}
        </div>
      );
    }
    return (
      <div className="catalog-placeholder">
        <img src="/images/player/running.png" alt="Travel" />
      </div>
    );
  };

  return (
    <div className="catalog">
      <div className="catalog-top">
        <h3>Travel</h3>
        <input
          className="form-control"
          placeholder="Where to?"
          value={citySearchKey}
          onChange={(e) => searchCity(e.target.value.trim().toLowerCase())}
        />
        {flightInfo && (
          <div
            className="text-muted"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "1em",
            }}
          >
            <p style={{ marginBottom: 0 }}>{`Distance ${flightInfo.distance}`}</p>
            <p style={{ marginBottom: 0 }}>{`Est. ${flightInfo.duration}`}</p>
          </div>
        )}
      </div>
      {renderFlightsOrSuggestions()}
    </div>
  );
};

TravelCatalog.propTypes = {
  travelCatalogOpen: PropTypes.bool.isRequired,
  citySearchKey: PropTypes.string.isRequired,
  citySearchSuggestions: PropTypes.arrayOf(PropTypes.string).isRequired,
  flightInfo: PropTypes.objectOf(PropTypes.string).isRequired,
  flights: PropTypes.arrayOf(PropTypes.object).isRequired,
  searchCity: PropTypes.func.isRequired,
  setDestinationCity: PropTypes.func.isRequired,
  travel: PropTypes.func.isRequired,
};

export default connect(
  ({ travelCatalogOpen, citySearchKey, citySearchSuggestions, flightInfo, flights }) => ({
    travelCatalogOpen,
    citySearchKey,
    citySearchSuggestions,
    flightInfo,
    flights,
  }),
  { searchCity, setDestinationCity, travel }
)(TravelCatalog);
