import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";

import Spinner from "./Spinner";
import ModalSm from "./ModalSm";
import FormInput from "./FormInput";
import * as Actions from "../store/actions";
import * as apiActions from "../store/actions/apiActions";
import { fieldValidationsRegister, run } from "../utils/";

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showErrors: false,
      submit: false
    };
    this.handleInput = this.handleInput.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.errorFor = this.errorFor.bind(this);
  }

  componentDidMount() {}

  /* Function handleRegister - Perform basic validation:
  * - username is at least 1 char
  * - password is at least 1 char
  * - password confirmation matches
  * If valid, call the register route; store token in redux, clear password
  * from state, return to Home
  */
  handleRegister() {
    // clear previous errors
    this.props.actions.setRegError("");
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPwd
    } = this.props.login.form;

    // show validation errors
    this.setState({ showErrors: true, submit: true });
    const validationErrors = run(
      this.props.login.form,
      fieldValidationsRegister
    );
    this.setValidationErrors(validationErrors);

    if (!Object.values(this.props.login.validationErrors).length) {
      const body = { firstName, lastName, email, password };
      this.props.api
        .registration(body)
        .then(result => {
          if (result.type === "REGISTRATION_FAILURE") {
            console.log("registration failure");
            this.setState({ showErrors: true });
          }
          if (result.type === "REGISTRATION_SUCCESS") {
            console.log("registration success");
            // clear form
            this.props.actions.setFormField({
              firstName: "",
              lastName: "",
              email: "",
              password: "",
              confirmPwd: "",
              error: ""
            });
            // this.props.history.push("/");
          }
        })
        .catch(err => {
          console.log("neither success nor failure???");
          // console.log(err.response.data.message);
          let error;
          console.log(err);
          console.dir(err);
          typeof err === "string"
            ? (error = err)
            : typeof err.error === "string"
              ? (error = err.error)
              : typeof err.message === "string"
                ? (error = err.message)
                : (error = undefined);
          console.log(error);
          this.props.actions.setRegError(error);
          this.props.actions.setFormField({
            error: err
          });
          this.setState({ showErrors: true });
        });
    } else if (!email) {
      console.log("Email cannot be blank");
      this.props.actions.setRegError("Email cannot be blank");
    } else if (password !== confirmPwd) {
      console.log("Passwords do not match");
      this.props.actions.setRegError("Passwords do not match");
    } else if (!firstName || !lastName) {
      console.log("Full name is required");
      this.props.actions.setRegError("Full name is required");
    } else {
      this.props.actions.setRegError("Please complete the form");
      console.log("Please complete the form");
    }
  }

  /*
  * Function: handleInput - On Change, send updated value to redux
  * @param {object} event - the change event triggered by the input.
  * All form inputs will use this handler; trigger the proper action
  * based on the input ID
  */
  handleInput(e) {
    this.props.actions.setFormField(e.target.id, e.target.value);
    if (e.which === 13) {
      this.handleRegister();
    }
  }

  handleBlur(e) {
    // set current field as 'touched'
    const field = e.target.name;
    this.props.actions.setTouched(field);
    console.log("touched:");
    console.dir(this.props.login.touched);
    // run fieldValidations on fields in form object and save to redux store
    const validationErrors = run(
      this.props.login.form,
      fieldValidationsRegister
    );
    console.log("validationErrors:");
    console.dir(validationErrors);
    this.props.actions.setValidationErrors(validationErrors);
    console.log(
      `testing showErrors: Object.values(validationErrors).length = ${
        Object.values(validationErrors).length
      }`
    );
    console.log("touched:");
    console.dir(this.props.login.touched);
    const showErrors = !!(
      Object.values(validationErrors).length && this.props.login.touched[field]
    );
    this.setState({ showErrors });
  }

  handleFocus(e) {
    // hide validation errors for focused field
    const field = e.target.name;
    const validationErrors = run(
      this.props.login.form,
      fieldValidationsRegister
    );
    validationErrors[field] = false;
    this.props.actions.setValidationErrors(validationErrors);
    this.setState({ showErrors: false });
  }

  errorFor(field) {
    // run validation check and return error(s) for this field
    if (
      this.props.login.validationErrors[field] &&
      this.state.showErrors === true
    ) {
      console.log(
        `${field} error: ${this.props.login.validationErrors[field]}`
      );
      return this.props.login.validationErrors[field] || "";
    }
    return null;
  }

  render() {
    const errorClass =
      this.props.register.regErrorMsg || this.props.login.form.error
        ? "error"
        : "hidden";
    const { showErrors, submit } = this.state;
    console.log(`showErrors: ${showErrors}`);
    console.log(`submit: ${submit}`);
    return (
      // const showErrors = !!(Object.values(this.props.login.validationErrors).length && this.props.login.touched[field]);
      <div>
        <Spinner cssClass={this.props.register.spinnerClass} />
        <ModalSm
          modalClass={this.props.register.modal.class}
          modalText={this.props.register.modal.text}
          modalType="modal__info"
          modalTitle={this.props.register.modal.title}
          dismiss={() => {
            this.props.actions.dismissModal();
          }}
          action={() => {
            this.props.actions.dismissModal();
            this.props.history.push("/");
          }}
        />
        <form className="container form">
          <div className="form__body">
            <div className="form__header">Create new Account</div>
            <div className="form__input-group">
              <FormInput
                handleChange={this.handleInput}
                handleBlur={this.handleBlur}
                handleFocus={this.handleFocus}
                placeholder="First name"
                autoComplete="given-name"
                showError={showErrors}
                value={this.props.login.form.firstName}
                errorText={this.errorFor("firstName")}
                touched={this.props.login.touched.firstName}
                name="firstName"
                submit={submit}
              />
            </div>
            <div className="form__input-group">
              <FormInput
                handleChange={this.handleInput}
                handleBlur={this.handleBlur}
                handleFocus={this.handleFocus}
                placeholder="Last name"
                autoComplete="family-name"
                showError={showErrors}
                value={this.props.login.form.lastName}
                errorText={this.errorFor("lastName")}
                touched={this.props.login.touched.lastName}
                name="lastName"
                submit={submit}
              />
            </div>
            <div className="form__input-group">
              <FormInput
                handleChange={this.handleInput}
                handleBlur={this.handleBlur}
                handleFocus={this.handleFocus}
                placeholder="Email"
                autoComplete="email"
                type="email"
                showError={showErrors}
                value={this.props.login.form.email}
                errorText={this.errorFor("email")}
                touched={this.props.login.touched.email}
                name="email"
                submit={submit}
              />
            </div>
            <div className="form__input-group">
              <FormInput
                handleChange={this.handleInput}
                handleBlur={this.handleBlur}
                handleFocus={this.handleFocus}
                placeholder="Password"
                autoComplete="new-password"
                type="password"
                showError={showErrors}
                value={this.props.login.form.password}
                errorText={this.errorFor("password")}
                touched={this.props.login.touched.password}
                name="password"
                submit={submit}
              />
            </div>
            <div className="form__input-group">
              <FormInput
                handleChange={this.handleInput}
                handleBlur={this.handleBlur}
                handleFocus={this.handleFocus}
                placeholder="Confirm Password"
                autoComplete="new-password"
                type="password"
                showError={showErrors}
                value={this.props.login.form.confirmPwd}
                errorText={this.errorFor("confirmPwd")}
                touched={this.props.login.touched.confirmPwd}
                name="confirmPwd"
                submit={submit}
              />
            </div>
            <div className="form__input-group">
              <div className="form__button-wrap">
                <button
                  className="form__button pointer"
                  id="btn-register"
                  type="button"
                  onClick={() => this.handleRegister()}
                >
                  Create account
                </button>
              </div>
            </div>
            <div className="form__input-group">
              <div className={errorClass}>
                {this.props.register.regErrorMsg}
              </div>
            </div>
            <div className="form__input-group">
              <Link className="form__login-link" to="/login">
                Login with existing account
              </Link>
            </div>
            <div className="form__input-group">
              <hr className="form__hr" />
              <div className="form__text">Or log in with&hellip;</div>
              <div className="form__button-wrap">
                <a
                  className="form__button form__button--github"
                  href="http://localhost:8080/api/auth/github/"
                  id="btn-github"
                >
                  <span>GH</span>
                </a>
                <a
                  className="form__button form__button--facebook"
                  id="btn-facebook"
                  href="http://localhost:8080/api/auth/facebook"
                >
                  <span>FB</span>
                </a>
                <a
                  className="form__button form__button--google"
                  id="btn-google"
                  href="http://localhost:8080/api/auth/google"
                >
                  <span>G+</span>
                </a>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

Register.propTypes = {
  api: PropTypes.shape({
    registration: PropTypes.func
  }).isRequired,
  register: PropTypes.shape({
    regErrorMsg: PropTypes.string,
    spinnerClass: PropTypes.string,
    modal: PropTypes.shape({
      class: PropTypes.string,
      text: PropTypes.string,
      title: PropTypes.string
    })
  }).isRequired,
  actions: PropTypes.shape({
    setRegError: PropTypes.func,
    dismissModal: PropTypes.func
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func
  }).isRequired
};

const mapStateToProps = state => ({
  register: state.register,
  login: state.login
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch),
  api: bindActionCreators(apiActions, dispatch)
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Register)
);
