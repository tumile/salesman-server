import axios from "axios";
import PropTypes from "prop-types";
import React from "react";

class Travel extends React.Component {
  state = {
    search: "",
    suggestions: [],
    destination: null,
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
          const res = await axios.get(`/api/cities/search?query=${input}`);
          this.setState({ suggestions: res.data, flights: [] });
        }
      }
    }, 200);
  };

  handleFlights = async (city) => {
    const currentCity = this.props.player.city;
    const res = await axios.get(`/api/flights?from=${currentCity.id}&to=${city.id}`);
    this.setState({ flights: res.data, search: city.name, destination: city });
  };

  handleBooking = async (flight) => {
    try {
      const { destination } = this.state;
      await axios.post(`/api/flights`, {
        fromCityId: this.props.player.city.id,
        toCityId: destination.id,
        airlineId: flight.id,
        price: flight.price,
      });
      await this.props.getPlayer();
      await this.props.getCity();
    } catch (err) {
      console.error(err.response.data);
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
          <div key={flight.id} className="side-list-item">
            <img className="img-fluid rounded" src={flight.image} alt={flight.name} />
            <div className="side-list-item-body">
              <h6>{flight.name}</h6>
              <div>
                <span>{`$${flight.price}`}</span>
                <button type="button" className="btn btn-primary btn-sm" onClick={() => this.handleBooking(flight)}>
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
            key={city.id}
            type="button"
            className="list-group-item list-group-item-action"
            onClick={() => this.handleFlights(city)}
          >
            {city.name}
          </button>
        ))}
      </div>
    );
  };

  render() {
    if (!this.props.open) {
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
  open: PropTypes.bool.isRequired,
  player: PropTypes.object.isRequired,
  getPlayer: PropTypes.func.isRequired,
  getCity: PropTypes.func.isRequired,
};

export default Travel;
