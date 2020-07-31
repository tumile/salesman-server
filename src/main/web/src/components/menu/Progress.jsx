import PropTypes from "prop-types";
import React from "react";

class Progress extends React.Component {
  state = {};

  render() {
    if (!this.props.open) {
      return null;
    }
    return (
      <div className="modal" role="dialog" style={{ display: "block", top: 100 }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Progress</h5>
            </div>
            <div className="modal-body"></div>
          </div>
        </div>
      </div>
    );
  }
}

Progress.propTypes = {
  open: PropTypes.bool.isRequired,
};

export default Progress;
