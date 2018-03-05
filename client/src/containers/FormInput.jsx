import React, { Component } from "react";
import ErrorMessages from "./ErrorMessages";
import PropTypes from "prop-types";

class FormInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showError: props.showError,
      errorText: props.errorText,
      touched: props.touched,
      submit: props.submit
    };

    this.shouldDisplayError = this.shouldDisplayError.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.showError !== nextProps.showError) {
      console.log(
        `props.showError changed to ${nextProps.showError} for ${
          this.props.name
        }`
      );
    }
    // console.log(`NEXT PROPS:`);
    // console.dir(nextProps);
    this.setState({
      showError: nextProps.showError,
      errorText: nextProps.errorText,
      touched: nextProps.touched,
      submit: nextProps.submit
    });
  }

  shouldDisplayError() {
    if (this.state.touched) {
      console.log(`this.state.showError ${this.state.showError}:`);
      console.log(`this.state.errorText ${this.state.errorText}:`);
      console.log(`this.state.touched ${this.state.touched}:`);
      console.log(`this.state.submit ${this.state.submit}:`);
      console.log("formula equals:");
      console.log(
        this.state.showError &&
          this.state.errorText &&
          (this.state.touched || this.state.submit)
      );
    }
    // determine whether field should display error message
    return (
      this.state.showError &&
      this.state.errorText &&
      (this.state.touched || this.state.submit)
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
          autoComplete={this.props.autoComplete || null}
          placeholder={this.props.placeholder}
          value={this.props.value}
          onChange={this.props.handleChange}
          onBlur={this.props.handleBlur}
          onFocus={this.props.handleFocus}
          name={this.props.name}
          id={this.props.name}
          required={this.props.required}
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

FormInput.propTypes = {
  showError: PropTypes.bool,
  errorText: PropTypes.string,
  touched: PropTypes.bool,
  submit: PropTypes.bool,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.string,
  handleChange: PropTypes.func,
  handleBlur: PropTypes.func,
  handleFocus: PropTypes.func
};

export default FormInput;
