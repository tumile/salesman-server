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
    };
  }

  toggleTravel = (open) => {
    this.setState({
      travelOpen: open,
      inboxOpen: false,
    });
  };

  toggleEmail = (open) => {
    this.setState({
      travelOpen: false,
      inboxOpen: open,
    });
  };

  render() {
    const { player } = this.props;
    const { travelOpen, inboxOpen } = this.state;

    return (
      <>
        <div className="menu-stats">
          <img src="images/player/salesman.png" alt="Player" />
          <div>
            <span>
              <i className="fas fa-wallet" />
              {` $${Math.round(player.money)}`}
            </span>
            <div className="progress">
              <div style={{ width: `${player.stamina}%` }} className="progress-bar" role="progressbar" />
            </div>
          </div>
          <button type="button" className="btn">
            <i className="fas fa-home" />
          </button>
          <button type="button" className="btn">
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
        <Travel travelOpen={travelOpen} />
        <Inbox inboxOpen={inboxOpen} />
      </>
    );
  }
}

Menu.propTypes = {
  player: PropTypes.object.isRequired,
};

export default Menu;
