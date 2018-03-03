import React from "react";
import PropTypes from "prop-types";

const Spinner = props => (
  <div className={`spinner__wrap ${props.cssClass}`}>
    <div className={`spinner ${props.cssClass}`} />
    <span className="sr-only">Loading...</span>
  </div>
);

Spinner.propTypes = {
  cssClass: PropTypes.string.isRequired
};

export default Spinner;
