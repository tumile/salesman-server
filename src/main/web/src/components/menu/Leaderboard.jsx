import axios from "axios";
import React from "react";
import { CSSTransition } from "react-transition-group";

class Leaderboard extends React.Component {
  state = {
    players: [],
  };

  async componentDidMount() {
    const resp = await axios.get("/api/players/leaderboard");
    this.setState({ players: resp.data });
  }

  render() {
    const { players } = this.state;
    return (
      <CSSTransition in={this.props.open} timeout={200} classNames="fade-in" unmountOnExit>
        <div className="center">
          <h5>Leaderboard</h5>
          <div>
            {players.map((player) => (
              <div key={player.id} className="leaderboard-item">
                <img src={player.image} alt={player.username} />
                <span>{player.username}</span>
                <span>
                  <i className="fas fa-money-bill-wave mr-2" />
                  {player.money}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CSSTransition>
    );
  }
}

export default Leaderboard;
