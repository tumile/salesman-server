import PropTypes from "prop-types";
import React from "react";

const Inbox = (props) => {
  const { inboxOpen } = props;
  if (!inboxOpen) {
    return null;
  }
  return (
    <div className="side">
      <div className="side-top">
        <h3>Inbox</h3>
      </div>
      <div className="side-list">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="side-list-item">
            <h6>From: Emy</h6>
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

Inbox.propTypes = {
  inboxOpen: PropTypes.bool.isRequired,
};

export default Inbox;
