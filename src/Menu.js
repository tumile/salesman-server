import React from "react";

const Menu = (props) => {
  const { showTravelDrawer, showHotelDrawer } = props;

  return (
    <div className="fixed-top">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1em",
        }}
      >
        <div style={{ flex: 1 }}>
          <span>
            <i className="fas fa-wallet" /> $10000
          </span>
          <div className="progress" style={{ maxWidth: 300 }}>
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: "75%" }}
            />
          </div>
        </div>
        <div>
          <button
            className="btn btn-primary"
            style={{ marginRight: "1em" }}
            onClick={showTravelDrawer}
          >
            <i className="fas fa-plane-departure" /> Travel
          </button>
          <button className="btn btn-primary" onClick={showHotelDrawer}>
            <i className="fas fa-hotel" /> Stay
          </button>
        </div>
      </div>
    </div>
  );
};

export default Menu;
