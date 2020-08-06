import React from "react";
import { CSSTransition } from "react-transition-group";

class Inbox extends React.Component {
  async componentDidMount() {
    await this.props.getCustomers();
  }

  getTimeString = (expireAt) => {
    let mins = Math.round((new Date(expireAt) - new Date()) / 60000);
    const hours = Math.floor(mins / 60);
    mins %= 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  render() {
    return (
      <CSSTransition in={this.props.open} timeout={300} classNames="slide-right" unmountOnExit>
        <div className="side">
          <div className="side-top inbox-top">
            <h3>Inbox</h3>
            <div>
              <button type="button" className="btn mb-1" onClick={this.props.getCustomers}>
                <i className="fas fa-sync-alt" />
              </button>
            </div>
          </div>
          <div className="side-list">
            {this.props.customers.map((cust) => (
              <div key={cust.id} className="side-list-item">
                <div style={{ height: 60, overflow: "hidden" }}>
                  <img src={cust.image} alt={cust.name} />
                </div>
                <div className="side-list-item-body">
                  <h6>{`From: ${cust.name}`}</h6>
                  <p>{`${cust.message} Meet me in ${cust.city.name}.`}</p>
                  <span className="text-muted">
                    {cust.isExpired ? "Offer expired" : `Offer expires in ${this.getTimeString(cust.expireAt)}`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CSSTransition>
    );
  }
}

export default Inbox;
