import React from "react";
import PropTypes from 'prop-types';

const Logo = (props) => {
  return <div className="logo">{props.message}</div>;
};


Logo.propTypes = {
  message: PropTypes.string.isRequired
};


export default Logo;