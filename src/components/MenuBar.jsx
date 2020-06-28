import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { showHotelCatalog, showTravelCatalog } from "../state/game";

const MenuBar = (props) => {
  const { money, stamina, timer, travelCatalogOpen, hotelCatalogOpen, showTravelCatalog, showHotelCatalog } = props;

  const getTimeString = (timer) => {
    let hours = Math.floor(timer / 3600);
    hours = hours < 10 ? `0${hours}` : hours;
    let minutes = Math.floor(timer / 60) % 60;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    let seconds = timer % 60;
    seconds = seconds < 10 ? `0${seconds}` : seconds;
    return ` ${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="menu">
      <div className="menu-stats">
        <div>
          <i className="fas fa-clock" />
          {getTimeString(timer)}
        </div>
        <span>
          <i className="fas fa-wallet" />
          {` $${Math.round(money)}`}
        </span>
        <div className="progress">
          <div style={{ width: `${stamina}%` }} className="progress-bar" role="progressbar" />
        </div>
      </div>
      <div className="menu-btns">
        <button
          type="button"
          className={`btn${travelCatalogOpen ? " btn-primary" : " btn-outline-primary"}`}
          onClick={() => showTravelCatalog(!travelCatalogOpen)}
        >
          <i className="fas fa-plane-departure" />
        </button>
        <button
          type="button"
          className={`btn${hotelCatalogOpen ? " btn-primary" : " btn-outline-primary"}`}
          onClick={() => showHotelCatalog(!hotelCatalogOpen)}
        >
          <i className="fas fa-hotel" />
        </button>
      </div>
    </div>
  );
};

MenuBar.propTypes = {
  money: PropTypes.number.isRequired,
  stamina: PropTypes.number.isRequired,
  timer: PropTypes.number.isRequired,
  travelCatalogOpen: PropTypes.bool.isRequired,
  hotelCatalogOpen: PropTypes.bool.isRequired,
  showTravelCatalog: PropTypes.func.isRequired,
  showHotelCatalog: PropTypes.func.isRequired,
};

export default connect(
  ({ money, stamina, timer, travelCatalogOpen, hotelCatalogOpen }) => ({
    money,
    stamina,
    timer,
    travelCatalogOpen,
    hotelCatalogOpen,
  }),
  {
    showTravelCatalog,
    showHotelCatalog,
  }
)(MenuBar);
