import PropTypes from "prop-types";
import React from "react";

class Inbox extends React.Component {
  async componentDidMount() {
    await this.props.getCustomers();
  }

  render() {
    if (!this.props.open) {
      return null;
    }
    return (
      <div className="side">
        <div className="side-top">
          <h3>Inbox</h3>
        </div>
        <div className="side-list">
          {this.props.customers.map((cust) => (
            <div key={cust.id} className="side-list-item">
              <div style={{ height: 60, overflow: "hidden" }}>
                <img src={`images/customers/${cust.image}.png`} alt={cust.name} />
              </div>
              <div className="side-list-item-body">
                <h6>From: {cust.name}</h6>
                <p>
                  {cust.message} Meet me in {cust.city.name}.
                </p>
                <span className="text-muted">
                  Offer expires in about {Math.round((new Date(cust.expireTime) - new Date()) / 3600000)}h
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

Inbox.propTypes = {
  open: PropTypes.bool.isRequired,
  customers: PropTypes.array.isRequired,
  getCustomers: PropTypes.func.isRequired,
};

export default Inbox;
