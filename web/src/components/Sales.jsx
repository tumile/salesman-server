import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import "./Modal.css";
import { sell } from "../state/game";

const Sales = (props) => {
  const { customer, city, sell } = props;

  if (!customer) {
    return null;
  }

  const handleSell = () => {
    sell(customer);
  };

  return (
    <div className="modal">
      <div className="modal-content" style={{ backgroundImage: `url(${city.image})` }}>
        <div className="row">
          <div className="col-4 text-center">
            <img src={customer.image} alt="Customer" />
          </div>
          <div className="col-8">
            <div style={{ backgroundColor: "white", padding: "1rem", borderRadius: "0.25rem" }}>
              <p>Hi, I&lsquo;m looking to buy your product for ${customer.offer}.</p>
              <button type="button" className="btn btn-primary btn-sm" onClick={handleSell}>
                Cool
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Sales.propTypes = {
  customer: PropTypes.objectOf(PropTypes.string).isRequired,
  city: PropTypes.objectOf(PropTypes.string).isRequired,
  sell: PropTypes.func.isRequired,
};

export default connect(
  ({ customers, cities, currentCity }) => ({
    customer: customers.find((cust) => cust.city === currentCity),
    city: cities.find((city) => city.name === currentCity),
  }),
  { sell }
)(Sales);
