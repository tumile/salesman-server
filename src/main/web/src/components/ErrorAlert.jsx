import React from "react";
import { CSSTransition } from "react-transition-group";

const ErrorAlert = (props) => {
  const { error } = props;
  return (
    <CSSTransition in={!!error} timeout={200} classNames="fade-in" unmountOnExit>
      <div className="alert alert-danger error-alert" role="alert">
        {error}
      </div>
    </CSSTransition>
  );
};

export default ErrorAlert;
