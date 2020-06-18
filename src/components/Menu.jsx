import React from "react";
import HotelCatalog from "./HotelCatalog";
import "./Menu.css";
import MenuBar from "./MenuBar";
import TravelCatalog from "./TravelCatalog";

const Menu = () => {
  return (
    <>
      <MenuBar />
      <TravelCatalog />
      <HotelCatalog />
    </>
  );
};

export default Menu;
