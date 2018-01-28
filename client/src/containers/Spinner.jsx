import React from 'react';
import PropTypes from 'prop-types';

const Spinner = props => (
  <div className={`spinner ${props.cssClass}`}>
    <div className="spinner__content" />
    <span className="sr-only">Loading...</span>
  </div>
);

Spinner.propTypes = {
  cssClass: PropTypes.string.isRequired,
};

export default Spinner;