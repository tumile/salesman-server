import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { showHotelCatalog, showTravelCatalog } from "../state/menu";

const MenuBar = (props) => {
  const { money, stamina, travelCatalogOpen, hotelCatalogOpen } = props;

  return (
    <div className="menu">
      <div className="menu-stats">
        <span>
          <i className="fas fa-wallet" />
          {` $${money}`}
        </span>
        <div className="progress">
          <div style={{ width: `${stamina}%` }} className="progress-bar" role="progressbar" />
        </div>
      </div>
      <div className="menu-btns">
        <button
          type="button"
          className={`btn${travelCatalogOpen ? " btn-primary" : " btn-outline-primary"}`}
          onClick={() => props.showTravelCatalog(!travelCatalogOpen)}
        >
          <i className="fas fa-plane-departure" />
        </button>
        <button
          type="button"
          className={`btn${hotelCatalogOpen ? " btn-primary" : " btn-outline-primary"}`}
          onClick={() => props.showHotelCatalog(!hotelCatalogOpen)}
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
  travelCatalogOpen: PropTypes.bool.isRequired,
  hotelCatalogOpen: PropTypes.bool.isRequired,
  showTravelCatalog: PropTypes.func.isRequired,
  showHotelCatalog: PropTypes.func.isRequired,
};

export default connect(
  ({ game: { money, stamina }, menu: { travelCatalogOpen, hotelCatalogOpen } }) => ({
    money,
    stamina,
    travelCatalogOpen,
    hotelCatalogOpen,
  }),
  {
    showTravelCatalog,
    showHotelCatalog,
  }
)(MenuBar);
