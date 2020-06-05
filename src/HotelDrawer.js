import React from "react";

const HotelDrawer = (props) => {
  const { isOpen, hideDrawer } = props;
  if (!isOpen) {
    return null;
  }
  return (
    <div
      className="fixed-bottom"
      style={{ display: "flex", flexDirection: "column" }}
    >
      <button
        className="btn btn-primary"
        style={{ alignSelf: "flex-end", marginRight: "1em" }}
        onClick={hideDrawer}
      >
        <i className="fas fa-times" />
      </button>
      <div
        style={{
          display: "flex",
          overflowX: "auto",
          whiteSpace: "nowrap",
          padding: "1em",
        }}
      >
        {[...Array(10)].map((_, i) => (
          <div key={i}>
            <div className="card" style={{ marginRight: "1em" }}>
              <div className="card-body">
                <h5 className="card-title">Intercontinental</h5>
                <p className="card-text">$1234</p>
                <button className="btn btn-primary btn-sm">Book</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HotelDrawer;
