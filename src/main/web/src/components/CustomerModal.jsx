import React from "react";
import { CSSTransition } from "react-transition-group";
import axios from "axios";

class CustomerModal extends React.Component {
  state = {
    negotiating: false,
    negotiateLeft: 3,
    negotiableAmount: undefined,
    negotiateMessage: null,
    negotiateEnd: false,
    negotiatePrice: "",
    finalPrice: undefined,
  };

  handleNegotiate = () => {
    const { customer } = this.props;
    const { negotiatePrice } = this.state;
    let { negotiableAmount } = this.state;
    if (negotiableAmount === undefined) {
      negotiableAmount = customer.price * (Math.floor(Math.random() * 15) / 100);
      this.setState({ negotiableAmount });
    }
    if (Number(negotiatePrice) > customer.price + negotiableAmount) {
      const negotiateLeft = this.state.negotiateLeft - 1;
      if (negotiateLeft === 0) {
        this.setState({
          negotiateEnd: true,
          negotiateMessage: `I'm afraid I can't do that. My final price is ${customer.price}`,
        });
      } else {
        this.setState((prev) => ({
          negotiateLeft: prev.negotiateLeft - 1,
          negotiateMessage: "Hmm, that's a little too high.",
        }));
      }
    } else {
      this.setState({ negotiateEnd: true, negotiateMessage: "Sounds good!" });
    }
    this.setState({ negotiating: false, negotiatePrice: "" });
  };

  handleConfirm = async () => {
    try {
      const { finalPrice, negotiateLeft } = this.state;
      const { customer } = this.props;
      await axios.put(`/api/customers/${customer.id}`, {
        price: finalPrice || customer.price,
        stamina: (3 - negotiateLeft) * 5,
      });
      await this.props.getPlayer();
      await this.props.getCustomers();
    } catch (err) {
      console.error(err.response.data.message);
    }
  };

  handleCancel = async () => {
    try {
      const { customer } = this.props;
      await axios.delete(`/api/customers/${customer.id}`);
      await this.props.getCustomers();
    } catch (err) {
      console.error(err.response.data.message);
    }
  };

  renderConversation = () => {
    const { negotiating, negotiateMessage, negotiatePrice, negotiateEnd } = this.state;
    const { customer } = this.props;
    if (negotiating) {
      return (
        <>
          <p>Cool, what&apos;s your price?</p>
          <div className="input-group input-group-sm">
            <input
              type="number"
              className="form-control"
              placeholder="Your offer"
              value={negotiatePrice}
              onChange={(e) => this.setState({ negotiatePrice: e.target.value })}
            />
            <div className="input-group-append">
              <button type="button" className="btn btn-outline-success btn-sm" onClick={this.handleNegotiate}>
                Offer
              </button>
            </div>
          </div>
        </>
      );
    }
    return (
      <>
        <p>{negotiateMessage || `${customer.message} My price is ${customer.price}.`}</p>
        <div className="btn-group btn-group-toggle float-right">
          <button type="button" className="btn btn-outline-primary btn-sm" onClick={this.handleConfirm}>
            Deal
          </button>
          {!negotiateEnd && (
            <button
              type="button"
              className="btn btn-outline-success btn-sm"
              onClick={() => this.setState({ negotiating: true })}
            >
              Negotiate -5❤️
            </button>
          )}
          <button type="button" className="btn btn-outline-danger btn-sm" onClick={this.handleCancel}>
            Nah
          </button>
        </div>
      </>
    );
  };

  render() {
    const { customer } = this.props;
    if (!customer) {
      return null;
    }
    return (
      <CSSTransition in={!!customer} timeout={200} classNames="fade-in" unmountOnExit>
        <div className="customer-background">
          <div className="customer">
            <img src={customer.image} alt="Customer" />
            <div className="customer-content">
              <h6>{customer.name}</h6>
              {this.renderConversation()}
            </div>
          </div>
        </div>
      </CSSTransition>
    );
  }
}

export default CustomerModal;
