import React from "react";

const TravelDrawer = (props) => {
  const { isOpen, hideDrawer } = props;
  if (!isOpen) {
    return null;
  }
  return (
    <div className="fixed-bottom">
      <div style={{ padding: "1em 1em 0 1em" }}>
        <button
          className="btn btn-primary"
          style={{ float: "right", marginBottom: "1em" }}
          onClick={hideDrawer}
        >
          <i className="fas fa-times" />
        </button>
        <input className="form-control" placeholder="Where to?" />
      </div>
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
                <h5 className="card-title">British Airways</h5>
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

export default TravelDrawer;
