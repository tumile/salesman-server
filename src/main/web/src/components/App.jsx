import axios from "axios";
import React from "react";
import "./App.css";
import Auth from "./auth/Auth";
import CustomerModal from "./CustomerModal";
import ErrorAlert from "./ErrorAlert";
import MainMap from "./map/MainMap";
import Menu from "./menu/Menu";

const AUTHORIZATION_HEADER = "Authorization";

class App extends React.Component {
  state = {
    loaded: false,
    player: null,
    city: null,
    customers: [],
    error: null,
  };

  async componentDidMount() {
    const token = localStorage.getItem("token");
    if (token) {
      this.setAuthorization(token);
      await this.getPlayer();
    }
    this.setState({ loaded: true });
  }

  setAuthorization = (token) => {
    if (token) {
      axios.defaults.headers.common[AUTHORIZATION_HEADER] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common[AUTHORIZATION_HEADER];
    }
  };

  handleError = (err) => {
    if (err.response) {
      this.setState({ error: err.response.data.message });
      setTimeout(() => this.setState({ error: null }), 2000);
    } else {
      this.setState({ error: "Something went wrong 😥" });
    }
  };

  getPlayer = async () => {
    try {
      const res = await axios.get("/api/players/me");
      this.setState({ player: res.data });
    } catch (err) {
      this.handleError(err);
    }
  };

  getCustomers = async () => {
    try {
      const res = await axios.get("/api/customers");
      this.setState({ customers: res.data });
    } catch (err) {
      this.handleError(err);
    }
  };

  getCity = async () => {
    try {
      const { id } = this.state.player.city;
      const res = await axios.get(`/api/cities/${id}`);
      this.setState({ city: res.data });
    } catch (err) {
      this.handleError(err);
    }
  };

  render() {
    const { loaded, player, city, customers, error } = this.state;
    if (!loaded) {
      return null;
    }
    if (!player) {
      return <Auth getPlayer={this.getPlayer} setAuthorization={this.setAuthorization} />;
    }
    const customer = customers.find((cust) => cust.city.id === (city ? city.id : undefined));
    return (
      <div>
        <Menu
          player={player}
          customers={customers}
          getPlayer={this.getPlayer}
          getCustomers={this.getCustomers}
          getCity={this.getCity}
        />
        <MainMap player={player} customers={customers} city={city} getCity={this.getCity} />
        <CustomerModal customer={customer} getPlayer={this.getPlayer} getCustomers={this.getCustomers} />
        <ErrorAlert error={error} />
      </div>
    );
  }
}

export default App;
