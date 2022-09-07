import React from "react";
import PropTypes from 'prop-types';
import "./style.less"
const Button = (props) => {
  return <button className="btn-primary">{props.label}</button>;
};


Button.propTypes = {
  label: PropTypes.string.isRequired
};


export default Button;