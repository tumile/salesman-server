import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";

const Email = (props) => {
  const { emailOpen } = props;

  return (
    <div className={`side animate__animated ${emailOpen ? "animate__fadeInRight" : "animate__fadeOutRight"}`}>
      <div className="side-top">
        <h3>Emails</h3>
      </div>
      <div className="side-list">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="side-list-item">
            <h6>InterContinental</h6>
            <div className="side-list-item-body">
              <span>$1234</span>
              <button type="button" className="btn btn-primary btn-sm">
                Book
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

Email.propTypes = {
  emailOpen: PropTypes.bool.isRequired,
  customers: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default connect(({ customers }) => ({ customers }))(Email);
