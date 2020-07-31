import PropTypes from "prop-types";
import React from "react";

const Icon = (props) => {
  const { src, avatar } = props;
  return (
    <div>
      <img className={avatar ? "icon-avatar" : "icon"} src={src} alt="Icon" />
    </div>
  );
};

Icon.propTypes = {
  src: PropTypes.string.isRequired,
  avatar: PropTypes.bool,
};

export default Icon;
