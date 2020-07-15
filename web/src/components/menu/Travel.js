import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { travel } from "../../state/game";
import WorldMap from "./WorldMap";

class Travel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      suggestions: [],
      destination: "",
      flights: [],
      flightInfo: null,
    };
  }

  handleSearch = (e) => {
    const input = e.target.value.trim().toLowerCase();
    this.setState({ search: input });
    if (input) {
      this.setState({ suggestions: [] });
    }
  };

  render() {
    const { travelOpen } = this.props;
    if (!travelOpen) {
      return null;
    }
    const { search, suggestions, flights } = this.state;

    return (
      <div className="travel" style={{ display: "flex" }}>
        <WorldMap />
        <div className="side">
          <div className="side-top">
            <h3>Travel</h3>
            <input className="form-control" placeholder="Where to?" value={search} onChange={this.handleSearch} />
          </div>
          {flights.length > 0 ? (
            <div className="side-list">
              {flights.map((flight) => (
                <div key={flight.name} className="side-list-item">
                  <img className="img-fluid rounded" src={flight.image} alt={flight.name} />
                  <div className="side-list-item-body">
                    <h6>{flight.name}</h6>
                    <div>
                      <span>{`$${flight.price}`}</span>
                      <button type="button" className="btn btn-primary btn-sm" onClick={() => {}}>
                        Book
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : suggestions.length > 0 ? (
            <div className="list-group px-3">
              {suggestions.map((city) => (
                <button key={city} type="button" className="list-group-item list-group-item-action" onClick={() => {}}>
                  {city}
                </button>
              ))}
            </div>
          ) : (
            <div className="side-placeholder">
              <img src="/images/player/running.png" alt="Travel" />
            </div>
          )}
        </div>
      </div>
    );
  }
}

Travel.propTypes = {
  travelOpen: PropTypes.bool.isRequired,
};

export default connect(null, { travel })(Travel);
