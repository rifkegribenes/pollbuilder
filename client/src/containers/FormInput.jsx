import React, { Component } from "react";
import ErrorMessages from "./ErrorMessages";
import PropTypes from "prop-types";

class FormInput extends Component {
  constructor(props) {
    super(props);
    this.shouldDisplayError = this.shouldDisplayError.bind(this);
  }

  shouldDisplayError() {
    // determine whether field should display error message
    return (
      this.props.showError &&
      this.props.errorText &&
      (this.props.touched || this.props.submit)
    );
  }

  render() {
    return (
      <div className="form__input-group">
        <label htmlFor={this.props.name} className="form__label">
          {this.props.placeholder}
        </label>
        <input
          className={
            this.shouldDisplayError()
              ? "form__input form__input--error"
              : "form__input"
          }
          type={this.props.type || "text"}
          placeholder={this.props.placeholder}
          value={this.props.value}
          onChange={this.props.handleChange}
          onBlur={this.props.handleBlur}
          onFocus={this.props.handleFocus}
          name={this.props.name}
          id={this.props.name}
        />
        <ErrorMessages display={this.shouldDisplayError()}>
          <div className="form__error-wrap">
            <span className="form__error-content">{this.props.errorText}</span>
          </div>
        </ErrorMessages>
      </div>
    );
  }
}

FormInput.PropTypes = {
  showError: PropTypes.boolean,
  errorText: PropTypes.string,
  touched: PropTypes.boolean,
  submit: PropTypes.boolean,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.string,
  handleChange: PropTypes.func,
  handleBlur: PropTypes.func,
  handleFocus: PropTypes.func
};

export default FormInput;
