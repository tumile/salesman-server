import React from "react";
import Inbox from "./Inbox";
import Leaderboard from "./Leaderboard";
import "./Menu.css";
import Progress from "./Progress";
import Travel from "./Travel";

class Menu extends React.Component {
  defaultState = {
    leaderboardOpen: false,
    progressOpen: false,
    travelOpen: false,
    inboxOpen: false,
  };

  state = {
    ...this.defaultState,
  };

  toggleLeaderboard = () => {
    this.setState((prev) => ({ ...this.defaultState, leaderboardOpen: !prev.leaderboardOpen }));
  };

  toggleProgress = () => {
    this.setState((prev) => ({ ...this.defaultState, progressOpen: !prev.progressOpen }));
  };

  toggleTravel = () => {
    this.setState((prev) => ({ ...this.defaultState, travelOpen: !prev.travelOpen }));
  };

  toggleInbox = () => {
    this.setState((prev) => ({ ...this.defaultState, inboxOpen: !prev.inboxOpen }));
  };

  render() {
    const { player, customers, getPlayer, getCity, getCustomers } = this.props;
    const { leaderboardOpen, progressOpen, travelOpen, inboxOpen } = this.state;
    return (
      <>
        <div className="menu-player">
          <img className="avatar" src={player.image} alt="Player" />
          <div>
            <span>
              <i className="fas fa-money-bill-wave mr-1" />
              {player.money}
            </span>
            <div className="progress">
              <div style={{ width: `${player.stamina}%` }} className="progress-bar" />
            </div>
          </div>
          <button type="button" className="btn" onClick={this.toggleProgress}>
            <i className="fas fa-home" />
          </button>
          <button type="button" className="btn" onClick={this.toggleLeaderboard}>
            <i className="fas fa-trophy" />
          </button>
        </div>
        <div className="menu-controls">
          <button type="button" className="btn btn-outline-primary" onClick={this.toggleTravel}>
            <i className="fas fa-plane-departure" />
          </button>
          <button type="button" className="btn btn-outline-primary" onClick={this.toggleInbox}>
            <i className="fas fa-envelope" />
          </button>
        </div>
        <Leaderboard open={leaderboardOpen} />
        <Progress open={progressOpen} />
        <Travel open={travelOpen} player={player} getPlayer={getPlayer} getCity={getCity} />
        <Inbox open={inboxOpen} customers={customers} getCustomers={getCustomers} />
      </>
    );
  }
}

export default Menu;
