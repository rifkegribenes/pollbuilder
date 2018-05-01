import React, { Component } from "react";
import ErrorMessages from "./ErrorMessages";
import PropTypes from "prop-types";

const show = () => {
  return (
    <svg version="1.1" x="0px" y="0px" viewBox="0 0 100 125">
      <g>
        <path d="M75.6,58.2c-0.4,0.4-0.4,1,0,1.4c0.4,0.4,1,0.4,1.4,0c2.8-2.6,5.4-5.7,7.7-9.1c0.2-0.3,0.2-0.8,0-1.1   C75.9,36.5,63.2,29,50,29s-25.9,7.5-34.6,20.4c-0.2,0.3-0.2,0.8,0,1.1C24.1,63.5,36.8,71,50,71c7.4,0,14.5-2.2,21-6.6   c0.8-0.5,1.5-1,2.3-1.6c0.4-0.3,0.5-1,0.2-1.4c-0.3-0.4-1-0.5-1.4-0.2c-0.7,0.5-1.4,1.1-2.2,1.5C63.7,66.9,57,69,50,69   c-12.4,0-24.2-6.9-32.6-19C25.8,37.9,37.6,31,50,31s24.2,6.9,32.6,19C80.5,53,78.1,55.8,75.6,58.2z" />
        <path d="M36.5,50c0,7.4,6.1,13.5,13.5,13.5S63.5,57.4,63.5,50S57.4,36.5,50,36.5S36.5,42.6,36.5,50z M61.5,50   c0,6.3-5.2,11.5-11.5,11.5S38.5,56.3,38.5,50S43.7,38.5,50,38.5S61.5,43.7,61.5,50z" />
      </g>
    </svg>
  );
};

const hide = () => {
  return (
    <svg version="1.1" x="0px" y="0px" viewBox="0 0 100 125">
      <g>
        <path d="M22.4,78.6c0.3,0,0.5-0.1,0.7-0.3l55.2-55.2c0.4-0.4,0.4-1,0-1.4s-1-0.4-1.4,0L21.7,76.9c-0.4,0.4-0.4,1,0,1.4   C21.9,78.5,22.2,78.6,22.4,78.6z" />
        <path d="M49,37c1.6,0,3.2,0.3,4.7,0.9c0.5,0.2,1.1-0.1,1.3-0.6c0.2-0.5-0.1-1.1-0.6-1.3c-1.8-0.7-3.6-1-5.4-1c-8.3,0-15,6.7-15,15   c0,1.8,0.3,3.7,1,5.4c0.2,0.4,0.5,0.6,0.9,0.6c0.1,0,0.2,0,0.4-0.1c0.5-0.2,0.8-0.8,0.6-1.3C36.3,53.2,36,51.6,36,50   C36,42.8,41.8,37,49,37z" />
        <path d="M49,63c-1.1,0-2.2-0.1-3.3-0.4c-0.5-0.1-1.1,0.2-1.2,0.7c-0.1,0.5,0.2,1.1,0.7,1.2c1.3,0.3,2.5,0.5,3.8,0.5   c8.3,0,15-6.7,15-15c0-1.2-0.2-2.5-0.5-3.8c-0.1-0.5-0.7-0.9-1.2-0.7c-0.5,0.1-0.9,0.7-0.7,1.2c0.3,1.1,0.4,2.2,0.4,3.3   C62,57.2,56.2,63,49,63z" />
        <path d="M9,50.4v0.1c0,0.3,0.1,0.5,0.3,0.7c6,5.8,11.6,10.2,17.3,13.5c0.2,0.1,0.3,0.1,0.5,0.1c0.3,0,0.7-0.2,0.9-0.5   c0.3-0.5,0.1-1.1-0.4-1.4c-5.2-3-10.7-7.3-16.2-12.6c18.3-17.7,32.7-23.1,48-18.2c0.5,0.2,1.1-0.1,1.3-0.6c0.2-0.5-0.1-1.1-0.6-1.3   c-16.1-5.1-31.7,0.8-50.7,19.4C9.1,49.9,9,50.2,9,50.4z" />
        <path d="M89,50.6v-0.1c0-0.3-0.1-0.5-0.3-0.7c-5.8-5.7-11.1-10-16.3-13.4c-0.5-0.3-1.1-0.2-1.4,0.3c-0.3,0.5-0.2,1.1,0.3,1.4   c4.9,3.1,9.9,7.2,15.4,12.5C70,66.5,55.2,72.1,40,68.3c-0.5-0.1-1.1,0.2-1.2,0.7c-0.1,0.5,0.2,1.1,0.7,1.2c3.2,0.8,6.4,1.2,9.6,1.2   c12.8,0,25.6-6.6,39.6-20.2C88.9,51.1,89,50.8,89,50.6z" />
      </g>
    </svg>
  );
};

class FormInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showError: props.showError,
      errorText: props.errorText,
      touched: props.touched,
      submit: props.submit,
      passwordViz: false
    };

    this.shouldDisplayError = this.shouldDisplayError.bind(this);
    this.togglePasswordViz = this.togglePasswordViz.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      showError: nextProps.showError,
      errorText: nextProps.errorText,
      touched: nextProps.touched,
      submit: nextProps.submit
    });
  }

  shouldDisplayError() {
    // determine whether field should display error message
    return (
      this.state.showError &&
      this.state.errorText &&
      (this.state.touched || this.state.submit)
    );
  }

  togglePasswordViz() {
    const newState = { ...this.state };
    newState.passwordViz = !this.state.passwordViz;
    this.setState({ ...newState });
  }

  render() {
    const inputType = type => {
      if (type === "password" && !this.state.passwordViz) {
        return "password";
      } else if (type === "password" && this.state.passwordViz) {
        return "text";
      } else {
        return this.props.type || "text";
      }
    };
    return (
      <div className="form__input-group">
        <label htmlFor={this.props.name} className="form__label">
          {this.props.label}
        </label>
        <input
          className={
            this.shouldDisplayError()
              ? "form__input form__input--error"
              : "form__input"
          }
          type={inputType(this.props.type)}
          autoComplete={this.props.autoComplete || null}
          placeholder={this.props.placeholder}
          value={this.props.value}
          onChange={this.props.handleChange}
          onBlur={this.props.handleBlur}
          onFocus={this.props.handleFocus}
          name={this.props.name}
          id={this.props.name}
          ref={this.props.inputRef}
          required={this.props.required}
        />
        {this.props.type === "password" && (
          <button
            className="aria-button form__password-toggle"
            onClick={() => this.togglePasswordViz()}
            type="button"
            title={this.state.passwordViz ? "hide password" : "show password"}
          >
            {this.state.passwordViz ? hide() : show()}
            <span className="sr-only">
              {this.state.passwordViz ? "hide password" : "show password"}
            </span>
          </button>
        )}
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
  label: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.string,
  handleChange: PropTypes.func,
  handleBlur: PropTypes.func,
  handleFocus: PropTypes.func
};

export default FormInput;
