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
    };
  }

  async componentDidMount() {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const { id } = jwtDecode(token);
        const player = await fetch(`/api/players/${id}`).then((res) => res.json());
        this.setState({ player });
      }
    } catch (err) {
      console.error(err);
    }
  }

  render() {
    const { player } = this.state;
    if (!player) {
      return <Auth />;
    }
    return (
      <>
        <Menu player={player} />
        <PlayerMap player={player} />
      </>
    );
  }
}

export default App;
