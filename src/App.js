import React, { Fragment } from "react";
import HotelDrawer from "./HotelDrawer";
import Map from "./Map";
import Menu from "./Menu";
import TravelDrawer from "./TravelDrawer";

export default function App() {
  const [travelDrawerOpen, setTravelDrawerOpen] = React.useState(false);
  const [hotelDrawerOpen, setHotelDrawerOpen] = React.useState(false);

  const showTravelDrawer = () => {
    setHotelDrawerOpen(false);
    setTravelDrawerOpen(true);
  };

  const showHotelDrawer = () => {
    setTravelDrawerOpen(false);
    setHotelDrawerOpen(true);
  };

  return (
    <Fragment>
      <Menu
        showTravelDrawer={showTravelDrawer}
        showHotelDrawer={showHotelDrawer}
      />
      <Map />
      <TravelDrawer
        isOpen={travelDrawerOpen}
        hideDrawer={() => setTravelDrawerOpen(false)}
      />
      <HotelDrawer
        isOpen={hotelDrawerOpen}
        hideDrawer={() => setHotelDrawerOpen(false)}
      />
    </Fragment>
  );
}
