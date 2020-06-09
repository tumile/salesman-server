import React from "react";
import { connect } from "react-redux";
import { showHotelCatalog, showTravelCatalog } from "../store/menu";

const MenuBar = (props) => {
  const { money, stamina, travelCatalogOpen, hotelCatalogOpen } = props;
  const { showTravelCatalog, showHotelCatalog } = props;

  return (
    <div className="menu">
      <div className="menu-stats">
        <span>
          <i className="fas fa-wallet" /> ${money}
        </span>
        <div className="progress">
          <div style={{ width: stamina + "%" }} className="progress-bar" role="progressbar" />
        </div>
      </div>
      <div className="menu-btns">
        <button
          className={"btn" + (travelCatalogOpen ? " btn-primary" : " btn-outline-primary")}
          onClick={() => showTravelCatalog(!travelCatalogOpen)}>
          <i className="fas fa-plane-departure" />
        </button>
        <button
          className={"btn" + (hotelCatalogOpen ? " btn-primary" : " btn-outline-primary")}
          onClick={() => showHotelCatalog(!hotelCatalogOpen)}>
          <i className="fas fa-hotel" />
        </button>
      </div>
    </div>
  );
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
