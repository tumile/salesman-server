import React, { useState } from "react";
import { connect } from "react-redux";

const TravelCatalog = (props) => {
  const { travelCatalogOpen } = props;
  const [destination, setDestination] = useState("");

  if (!travelCatalogOpen) {
    return null;
  }

  return (
    <div className="catalog">
      <div className="catalog-top">
        <h3>Travel</h3>
        <input
          className="form-control"
          placeholder="Where to?"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
      </div>
      {!destination ? (
        <div className="catalog-placeholder">
          <img src="/images/running.png" alt="Travel" />
        </div>
      ) : (
        <div className="catalog-list">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="catalog-list-item">
              <h6>British Airways</h6>
              <div className="catalog-list-item-body">
                <span>$1234</span>
                <button className="btn btn-primary btn-sm">Book</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default connect(({ menu: { travelCatalogOpen } }) => ({ travelCatalogOpen }))(TravelCatalog);
