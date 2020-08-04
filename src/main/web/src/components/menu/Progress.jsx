import React from "react";
import { CSSTransition } from "react-transition-group";

class Progress extends React.Component {
  state = {};

  render() {
    return (
      <CSSTransition in={this.props.open} timeout={200} classNames="fade-in" unmountOnExit>
        <div className="center">
          <h5>Progress</h5>
          <div>Brewing</div>
        </div>
      </CSSTransition>
    );
  }
}

export default Progress;
