import axios from "axios";
import PropTypes from "prop-types";
import React from "react";

class Leaderboard extends React.Component {
  state = {
    leaderboard: [],
  };

  async componentDidMount() {
    const resp = await axios.get("/api/leaderboard");
    this.setState({ leaderboard: resp.data });
  }

  render() {
    const { leaderboardOpen } = this.props;
    if (!leaderboardOpen) {
      return null;
    }
    const { leaderboard } = this.state;
    return (
      <div className="modal" role="dialog" style={{ display: "block", top: 100 }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Leaderboard</h5>
            </div>
            <div className="modal-body">
              {leaderboard.map((player) => (
                <div
                  key={player._id}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: 8 }}
                >
                  <img style={{ width: 50, borderRadius: 25 }} src={player.image} alt={player.username} />
                  <span>{player.username}</span>
                  <span>${player.money}</span>
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
  leaderboardOpen: PropTypes.bool.isRequired,
};

export default Leaderboard;
