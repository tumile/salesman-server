import axios from "axios";
import React from "react";
import { CSSTransition } from "react-transition-group";

class Travel extends React.Component {
  defaultState = {
    search: "",
    suggestions: [],
    flights: [],
    selectedCity: {},
    selectedFlight: {},
    loading: false,
    transiting: false,
    booking: false,
    bookingError: "",
    bookingErrorIdx: 0,
  };

  state = {
    ...this.defaultState,
  };

  handleSearch = (e) => {
    let input = e.target.value;
    this.setState({ search: input });
    setTimeout(async () => {
      if (this.state.search === input) {
        input = input.trim();
        if (!input) {
          this.setState({ suggestions: [], flights: [] });
          return;
        }
        try {
          this.setState({ loading: true });
          const res = await axios.get(`/api/cities/search?query=${input}`);
          this.setState({ suggestions: res.data, flights: [] });
        } catch (err) {
          console.error(err);
        } finally {
          this.setState({ loading: false });
        }
      }
    }, 200);
  };

  handleCitySelect = async (city) => {
    try {
      this.setState({ loading: true, search: city.name });
      const currentCity = this.props.player.city;
      const res = await axios.get(`/api/cities/${currentCity.id}/${city.id}/flights`);
      this.setState({ flights: res.data, selectedCity: city });
    } catch (err) {
      console.error(err);
    } finally {
      this.setState({ loading: false });
    }
  };

  handleFlightSelect = (flight) => {
    if (flight.price > this.props.player.money) {
      this.setState({ bookingError: "Not enough money", bookingErrorId: flight.id });
    } else if (this.props.player.stamina < 33) {
      this.setState({ bookingError: "Not enough stamina", bookingErrorId: flight.id });
    } else {
      this.setState({ selectedFlight: flight });
    }
  };

  handleConfirm = async () => {
    try {
      this.setState({ booking: true });
      await axios.post(`/api/travel`, {
        fromCityId: this.props.player.city.id,
        toCityId: this.state.selectedCity.id,
        airlineId: this.state.selectedFlight.id,
        price: this.state.selectedFlight.price,
      });
      this.setState({ ...this.defaultState, transiting: true });
      setTimeout(() => this.setState({ transiting: false }), 4000);
      await this.props.getPlayer();
      await this.props.getCity();
      await this.props.getCustomers();
    } catch (err) {
      console.error(err);
    } finally {
      this.setState({ booking: false });
    }
  };

  getDurationString = (duration) => {
    let mins = Math.round(duration / 60000);
    const hours = Math.floor(mins / 60);
    mins %= 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  renderFlightsOrSuggestions = () => {
    const { loading, flights, suggestions } = this.state;
    if (loading) {
      return (
        <div className="m-auto spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      );
    }
    if (flights.length > 0) {
      return (
        <div className="side-list">
          {this.state.flights.map((flight) => (
            <div key={flight.id} className="side-list-item">
              <img className="img-fluid" src={flight.image} alt={flight.name} />
              <div className="side-list-item-body">
                <h6>{flight.airline}</h6>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span>{`$${flight.price}`}</span>
                  <span>{this.getDurationString(flight.duration)}</span>
                  {this.renderBookButton(flight)}
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }
    if (suggestions.length > 0) {
      return (
        <div className="list-group">
          {this.state.suggestions.map((city) => (
            <button
              key={city.id}
              type="button"
              className="list-group-item list-group-item-action"
              onClick={() => this.handleCitySelect(city)}
            >
              {city.name}
            </button>
          ))}
        </div>
      );
    }
    return (
      <div className="m-auto text-center">
        <img className="w-50" src="/images/player/running.png" alt="Travel" />
      </div>
    );
  };

  renderBookButton = (flight) => {
    const { selectedFlight, booking, bookingError, bookingErrorId } = this.state;
    if (flight.id !== selectedFlight.id) {
      return (
        <div>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => this.handleFlightSelect(flight)}
            disabled={booking}
          >
            Book
          </button>
          {bookingError && flight.id === bookingErrorId && (
            <div className="invalid-feedback d-block">{bookingError}</div>
          )}
        </div>
      );
    }
    if (booking) {
      return (
        <div className="spinner-border spinner-border-sm text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      );
    }
    return (
      <button type="button" className="btn btn-success btn-sm" onClick={this.handleConfirm}>
        Confirm
      </button>
    );
  };

  render() {
    return (
      <>
        <CSSTransition in={this.props.open} timeout={300} classNames="slide-right" unmountOnExit>
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
        </CSSTransition>

        <CSSTransition in={this.state.transiting} timeout={300} classNames="fade-in" unmountOnExit>
          <video
            autoPlay
            className="transition-video"
            src="https://salesman-public.s3.amazonaws.com/takeoff.mp4"
            type="video/mp4"
          >
            <track default kind="captions" />
            Your browser does not support the video tag 😢
          </video>
        </CSSTransition>
      </>
    );
  }
}

export default Travel;
