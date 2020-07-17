import PropTypes from "prop-types";
import React from "react";
import Inbox from "./Inbox";
import "./Menu.css";
import Travel from "./Travel";

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      travelOpen: false,
      hotelOpen: false,
      inboxOpen: false,
      leaderboardOpen: false,
      sourvenirsOpen: false,
      leaderboard: [],
    };
  }

  toggleTravel = (open) => {
    this.setState({
      travelOpen: open,
      inboxOpen: false,
      leaderboardOpen: false,
      sourvenirsOpen: false,
    });
  };

  toggleEmail = (open) => {
    this.setState({
      travelOpen: false,
      inboxOpen: open,
      leaderboardOpen: false,
      sourvenirsOpen: false,
    });
  };

  toggleLeaderboard = () => {
    this.setState({ leaderboardOpen: !this.state.leaderboardOpen, sourvenirsOpen: false });
  };

  toggleSouvenirs = () => {
    this.setState({ sourvenirsOpen: !this.state.sourvenirsOpen, leaderboardOpen: false });
  };

  async componentDidMount() {
    const { players } = await fetch("/api/leaderboard").then((res) => res.json());
    this.setState({ leaderboard: players });
  }

  renderLeaderboard = () => {
    const { leaderboardOpen, leaderboard } = this.state;
    if (!leaderboardOpen) {
      return null;
    }
    return (
      <div className="modal" role="dialog" style={{ display: "block", top: 100 }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Hall of fame</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                onClick={this.toggleLeaderboard}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {leaderboard.map((p, i) => (
                <div
                  key={p._id}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: 8 }}
                >
                  <img style={{ width: 50, borderRadius: 25 }} src={p.image} />
                  <span>{p.username}</span>
                  <span>${p.money}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  renderSouvenirs = () => {
    const { sourvenirsOpen } = this.state;
    if (!sourvenirsOpen) {
      return null;
    }
    return (
      <div className="modal" role="dialog" style={{ display: "block", top: 100 }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Progress</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                onClick={this.toggleSouvenirs}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">Coming soon!</div>
          </div>
        </div>
      </div>
    );
  };

  render() {
    const { player, customers } = this.props;
    const { travelOpen, inboxOpen } = this.state;

    return (
      <>
        <div className="menu-stats">
          <img src={player.image} alt="Player" />
          <div>
            <span>
              <i className="fas fa-wallet" />
              {` $${Math.round(player.money)}`}
            </span>
            <div className="progress">
              <div style={{ width: `${player.stamina}%` }} className="progress-bar" role="progressbar" />
            </div>
          </div>
          <button type="button" className="btn" onClick={this.toggleSouvenirs}>
            <i className="fas fa-home" />
          </button>
          <button type="button" className="btn" onClick={this.toggleLeaderboard}>
            <i className="fas fa-trophy" />
          </button>
        </div>
        <div className="menu-btns">
          <button
            type="button"
            className={`btn ${travelOpen ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => this.toggleTravel(!travelOpen)}
          >
            <i className="fas fa-plane-departure" />
          </button>
          <button
            type="button"
            className={`btn ${inboxOpen ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => this.toggleEmail(!inboxOpen)}
          >
            <i className="fas fa-envelope" />
          </button>
        </div>
        {this.renderLeaderboard()}
        {this.renderSouvenirs()}
        <Travel travelOpen={travelOpen} player={player} refreshPlayer={this.props.refreshPlayer} />
        <Inbox inboxOpen={inboxOpen} customers={customers} />
      </>
    );
  }
}

Menu.propTypes = {
  player: PropTypes.object.isRequired,
};

export default Menu;
