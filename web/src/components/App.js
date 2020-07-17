import axios from "axios";
import jwtDecode from "jwt-decode";
import React from "react";
import "./App.css";
import Auth from "./auth/Auth";
import MainMap from "./map/MainMap";
import Menu from "./menu/Menu";

class App extends React.Component {
  state = {
    loaded: false,
    player: null,
    currentCity: null,
    customers: [],
  };

  async componentDidMount() {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const { id } = jwtDecode(token);
        await this.updatePlayer(id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      this.setState({ loaded: true });
    }
  }

  updatePlayer = async (id) => {
    const resp = await axios.get(`/api/players/${id || this.state.player._id}`);
    this.setState({ player: resp.data });
  };

  updateCustomers = async () => {
    const { _id } = this.state.player;
    const resp = await axios.get(`/api/players/${_id}/customers`);
    this.setState({ customers: resp.data });
  };

  updateCurrentCity = async () => {
    const { city } = this.state.player;
    const resp = await axios.get(`/api/cities/${city}`);
    this.setState({ currentCity: resp.data });
  };

  render() {
    const { player, currentCity, customers, loaded } = this.state;
    if (!loaded) {
      return null;
    }
    if (!player) {
      return <Auth updatePlayer={this.updatePlayer} />;
    }
    return (
      <>
        <Menu
          player={player}
          customers={customers}
          updatePlayer={this.updatePlayer}
          updateCustomers={this.updateCustomers}
          updateCurrentCity={this.updateCurrentCity}
        />
        <MainMap player={player} customers={customers} city={currentCity} updateCurrentCity={this.updateCurrentCity} />
      </>
    );
  }
}

export default App;
