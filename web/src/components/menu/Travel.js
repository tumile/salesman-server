import PropTypes from "prop-types";
import React from "react";

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

  renderFlightsOrSuggestions = () => {
    if (this.state.flights.length > 0) {
      return this.renderFlights();
    }
    if (this.state.suggestions.length > 0) {
      return this.renderSuggestions();
    }
    return (
      <div className="side-placeholder">
        <img src="/images/player/running.png" alt="Travel" />
      </div>
    );
  };

  renderFlights = () => {
    return (
      <div className="side-list">
        {this.state.flights.map((flight) => (
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
    );
  };

  renderSuggestions = () => {
    return (
      <div className="list-group px-3">
        {this.state.suggestions.map((city) => (
          <button key={city} type="button" className="list-group-item list-group-item-action" onClick={() => {}}>
            {city}
          </button>
        ))}
      </div>
    );
  };

  render() {
    const { travelOpen } = this.props;
    if (!travelOpen) {
      return null;
    }
    return (
      <div className="side">
        <div className="side-top">
          <h3>Travel</h3>
          <input
            className="form-control"
            placeholder="Where to?"
            value={this.state.search}
            onChange={this.handleSearch}
          />
        </div>
        {this.renderFlightsOrSuggestions()}
      </div>
    );
  }
}

Travel.propTypes = {
  travelOpen: PropTypes.bool.isRequired,
};

export default Travel;
