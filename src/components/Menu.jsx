import React, { Fragment } from "react";
import HotelCatalog from "./HotelCatalog";
import "./Menu.css";
import MenuBar from "./MenuBar";
import TravelCatalog from "./TravelCatalog";

const Menu = () => {
  return (
    <Fragment>
      <MenuBar />
      <TravelCatalog />
      <HotelCatalog />
    </Fragment>
  );
};

export default Menu;
