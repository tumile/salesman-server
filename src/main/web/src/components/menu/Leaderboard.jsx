import axios from "axios";
import PropTypes from "prop-types";
import React from "react";

class Leaderboard extends React.Component {
  state = {
    players: [],
  };

  async componentDidMount() {
    const resp = await axios.get("/api/players/leaderboard");
    this.setState({ players: resp.data });
  }

  render() {
    if (!this.props.open) {
      return null;
    }
    const { players } = this.state;
    return (
      <div className="modal" role="dialog" style={{ display: "block", top: 100 }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">players</h5>
            </div>
            <div className="modal-body">
              {players.map((player) => (
                <div
                  key={player.id}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: 8 }}
                >
                  <img style={{ width: 50, borderRadius: 25 }} src={player.image} alt={player.username} />
                  <span>{player.username}</span>
                  <span>
                    <i className="fas fa-money-bill-wave" />
                    {player.money}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Leaderboard.propTypes = {
  open: PropTypes.bool.isRequired,
};

export default Leaderboard;
