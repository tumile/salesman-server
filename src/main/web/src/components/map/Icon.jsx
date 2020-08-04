import React from "react";

const Icon = (props) => {
  const { src, avatar } = props;
  return (
    <div>
      <img className={avatar ? "icon-avatar" : "icon"} src={src} alt="Icon" />
    </div>
  );
};

export default Icon;
