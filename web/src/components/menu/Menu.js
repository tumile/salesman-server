import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import Email from "./Email";
import "./Menu.css";
import Travel from "./Travel";

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      travelOpen: false,
      hotelOpen: false,
      emailOpen: false,
    };
  }

  toggleTravel = (open) => {
    this.setState({
      travelOpen: open,
      emailOpen: false,
    });
  };

  toggleEmail = (open) => {
    this.setState({
      travelOpen: false,
      emailOpen: open,
    });
  };

  render() {
    const { money, stamina } = this.props;
    const { travelOpen, emailOpen } = this.state;

    return (
      <>
        <div className="menu-stats">
          <img src="images/player/salesman.png" alt="Player" />
          <div>
            <span>
              <i className="fas fa-wallet" />
              {` $${Math.round(money)}`}
            </span>
            <div className="progress">
              <div style={{ width: `${stamina}%` }} className="progress-bar" role="progressbar" />
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
            className={`btn${travelOpen ? " btn-primary" : " btn-outline-primary"}`}
            onClick={() => this.toggleTravel(!travelOpen)}
          >
            <i className="fas fa-plane-departure" />
          </button>
          <button
            type="button"
            className={`btn${emailOpen ? " btn-primary" : " btn-outline-primary"}`}
            onClick={() => this.toggleEmail(!emailOpen)}
          >
            <i className="fas fa-envelope" />
          </button>
        </div>
        <Travel travelOpen={travelOpen} />
        <Email emailOpen={emailOpen} />
      </>
    );
  }
}

Menu.propTypes = {
  money: PropTypes.number.isRequired,
  stamina: PropTypes.number.isRequired,
};

export default connect(({ money, stamina }) => ({ money, stamina }))(Menu);
