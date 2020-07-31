import axios from "axios";
import React from "react";
import "./App.css";
import Auth from "./auth/Auth";
import MainMap from "./map/MainMap";
import Menu from "./menu/Menu";

const AUTHORIZATION_HEADER = "Authorization";

class App extends React.Component {
  state = {
    loaded: false,
    player: null,
    city: null,
    customers: [],
  };

  async componentDidMount() {
    const token = localStorage.getItem("token");
    if (token) {
      this.setAuthorization(token);
      await this.getPlayer();
    }
    this.setState({ loaded: true });
  }

  getPlayer = async () => {
    try {
      const res = await axios.get("/api/players/me");
      this.setState({ player: res.data });
    } catch (err) {
      console.error(err.response.data);
    }
  };

  setAuthorization = (token) => {
    if (token) {
      axios.defaults.headers.common[AUTHORIZATION_HEADER] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common[AUTHORIZATION_HEADER];
    }
  };

  getCustomers = async () => {
    try {
      const res = await axios.get("/api/customers");
      this.setState({ customers: res.data });
    } catch (err) {
      console.error(err.response.data);
    }
  };

  getCity = async () => {
    try {
      const { id } = this.state.player.city;
      const res = await axios.get(`/api/cities/${id}`);
      this.setState({ city: res.data });
    } catch (err) {
      console.error(err.response.data);
    }
  };

  render() {
    const { player, city, customers, loaded } = this.state;
    if (!loaded) {
      return null;
    }
    if (!player) {
      return <Auth getPlayer={this.getPlayer} setAuthorization={this.setAuthorization} />;
    }
    return (
      <>
        <Menu
          player={player}
          customers={customers}
          getPlayer={this.getPlayer}
          getCustomers={this.getCustomers}
          getCity={this.getCity}
        />
        <MainMap player={player} customers={customers} city={city} getCity={this.getCity} />
      </>
    );
  }
}

export default App;
