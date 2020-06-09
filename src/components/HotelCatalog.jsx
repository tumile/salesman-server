import React from "react";
import { connect } from "react-redux";

const HotelCatalog = (props) => {
  const { hotelCatalogOpen } = props;

  if (!hotelCatalogOpen) {
    return null;
  }

  return (
    <div className="catalog">
      <div className="catalog-top">
        <h3>Hotel</h3>
      </div>
      <div className="catalog-list">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="catalog-list-item">
            <h6>InterContinental</h6>
            <div className="catalog-list-item-body">
              <span>$1234</span>
              <button className="btn btn-primary btn-sm">Book</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default connect(({ menu: { hotelCatalogOpen } }) => ({ hotelCatalogOpen }))(HotelCatalog);
