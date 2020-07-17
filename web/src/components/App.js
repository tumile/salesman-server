import jwtDecode from "jwt-decode";
import React from "react";
import "./App.css";
import Auth from "./auth/Auth";
import PlayerMap from "./map/MainMap";
import Menu from "./menu/Menu";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      player: null,
      customers: [],
    };
  }

  async componentDidMount() {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const { id } = jwtDecode(token);
        const { error, ...player } = await fetch(`/api/players/${id}`).then((res) => res.json());
        if (error) {
          throw error;
        }
        this.setPlayer(player);
        setInterval(async () => {
          await fetch(`/api/players/${id}/activity`, { method: "PUT" });
        }, 300000);
      }
    } catch (err) {
      console.error(err);
    }
  }

  refreshPlayer = async () => {
    const player = await fetch(`/api/players/${this.state.player._id}`).then((res) => res.json());
    this.setPlayer(player);
  };

  getCustomers = async (id) => {
    const { customers } = await fetch(`/api/players/${id}/customers`).then((res) => res.json());
    this.setState({ customers });
  };

  setPlayer = (player) => {
    this.setState({ player });
    this.getCustomers(player._id);
  };

  render() {
    const { player, customers } = this.state;
    if (!player) {
      return <Auth setPlayer={this.setPlayer} />;
    }
    return (
      <>
        <Menu player={player} customers={customers} refreshPlayer={this.refreshPlayer} />
        <PlayerMap player={player} />
      </>
    );
  }
}

export default App;
