import axios from "axios";
import PropTypes from "prop-types";
import React from "react";

class Travel extends React.Component {
  state = {
    search: "",
    suggestions: [],
    destination: "",
    flights: [],
  };

  handleSearch = (e) => {
    let input = e.target.value;
    this.setState({ search: input });
    setTimeout(async () => {
      if (this.state.search === input) {
        input = input.trim();
        if (!input) {
          this.setState({ suggestions: [], flights: [] });
        } else {
          const resp = await axios.get(`/api/cities/text?q=${input}`);
          this.setState({ suggestions: resp.data, flights: [] });
        }
      }
    }, 200);
  };

  handleFlight = async (city) => {
    const { player } = this.props;
    const resp = await axios.get(`/api/flights?f=${player.city}&t=${city._id}`);
    this.setState({ flights: resp.data, destination: city });
  };

  handleBook = async (price) => {
    try {
      const { player } = this.props;
      const { destination } = this.state;
      await axios.post(`/api/players/${player._id}/flight`, {
        destination: destination._id,
        price,
      });
      await this.props.updatePlayer();
      await this.props.updateCurrentCity();
    } catch (err) {
      console.error(err);
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
          <div key={flight._id} className="side-list-item">
            <img className="img-fluid rounded" src={flight.image} alt={flight.name} />
            <div className="side-list-item-body">
              <h6>{flight.name}</h6>
              <div>
                <span>{`$${flight.price}`}</span>
                <button type="button" className="btn btn-primary btn-sm" onClick={() => this.handleBook(flight.price)}>
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
      <div className="list-group">
        {this.state.suggestions.map((city) => (
          <button
            key={city._id}
            type="button"
            className="list-group-item list-group-item-action"
            onClick={() => this.handleFlight(city)}
          >
            {city.name}
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
  player: PropTypes.object.isRequired,
  updatePlayer: PropTypes.func.isRequired,
  updateCurrentCity: PropTypes.func.isRequired,
};

export default Travel;
