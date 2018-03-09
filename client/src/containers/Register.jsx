import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import update from "immutability-helper";

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
      showFormErrors: false,
      showFieldErrors: {
        firstName: false,
        lastName: false,
        email: false,
        password: false,
        confirmPwd: false
      },
      validationErrors: {},
      touched: {
        firstName: false,
        lastName: false,
        email: false,
        password: false,
        confirmPwd: false
      },
      submit: false
    };

    this.handleInput = this.handleInput.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.errorFor = this.errorFor.bind(this);
  }

  componentDidMount() {
    // clear previous errors
    this.props.actions.clearFormError();
  }

  /* Function handleRegister - Perform basic validation:
  * - username is at least 1 char
  * - password is at least 1 char
  * - password confirmation matches
  * If valid, call the register route; store token in redux, clear password
  * from state, return to Home
  */
  register() {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPwd
    } = this.props.login.form;

    // show validation errors
    const newState = { ...this.state };
    newState.submit = true;
    newState.showFormErrors = true;

    const validationErrors = run(
      this.props.login.form,
      fieldValidationsRegister
    );
    newState.validationErrors = { ...validationErrors };
    this.setState({ ...newState });

    if (!Object.values(this.state.validationErrors).length) {
      const body = { firstName, lastName, email, password };
      this.props.api
        .registration(body)
        .then(result => {
          if (result.type === "REGISTRATION_FAILURE") {
            this.props.actions.showErrors(true);
          }
          if (result.type === "REGISTRATION_SUCCESS") {
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
          let error;
          typeof err === "string"
            ? (error = err)
            : typeof err.error === "string"
              ? (error = err.error)
              : typeof err.message === "string"
                ? (error = err.message)
                : (error = undefined);
          this.props.actions.setFormError(error);
          this.props.actions.setFormField({
            error: err
          });
          // show validation errors
          const newState = { ...this.state };
          newState.showFormErrors = true;
          this.setState({ ...newState });
        });
    } else if (!email) {
      this.props.actions.setFormError("Email cannot be blank");
    } else if (password !== confirmPwd) {
      this.props.actions.setFormError("Passwords do not match");
    } else if (!firstName || !lastName) {
      this.props.actions.setFormError("Full name is required");
    } else {
      this.props.actions.setFormError("Please complete the form");
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
    const field = e.target.name;

    // run fieldValidations on fields in form object and save to state
    const validationErrors = run(
      this.props.login.form,
      fieldValidationsRegister
    );

    // use html5 input validation to check validitiy of email adress
    if (field === "email") {
      const validity = this.emailInput.validity;
      if (!validity.valid && validity.typeMismatch) {
        validationErrors.email = `Please enter a valid email address`;
      }
    }

    const showFormErrors = !!Object.values(validationErrors).length;

    // set current field as 'touched' and display errors onBlur
    const newState = update(this.state, {
      touched: {
        [field]: { $set: true }
      },
      showFieldErrors: {
        [field]: { $set: true }
      },
      validationErrors: { $set: { ...validationErrors } },
      showFormErrors: { $set: showFormErrors }
    });

    this.setState({ ...newState });
  }

  handleFocus(e) {
    const newState = { ...this.state };
    const field = e.target.name;
    newState.showFormErrors = false;
    newState.showFieldErrors[field] = false;
    // hide validation errors for focused field
    const validationErrors = run(
      this.props.login.form,
      fieldValidationsRegister
    );
    validationErrors[field] = false;
    newState.validationErorrs = { ...validationErrors };
    this.setState({ ...newState });
  }

  errorFor(field) {
    // run validation check and return error(s) for this field
    if (Object.values(this.state.validationErrors).length) {
      if (
        this.state.validationErrors[field] &&
        (this.state.showFormErrors === true ||
          this.state.showFieldErrors[field] === true)
      ) {
        return this.state.validationErrors[field] || "";
      }
    }
    return null;
  }

  render() {
    const errorClass =
      this.props.register.errorMsg || this.props.login.form.error
        ? "error"
        : "hidden";
    const buttonState = this.state.showFormErrors
      ? "form__button--disabled"
      : "";
    return (
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
                showError={this.state.showFieldErrors.firstName}
                value={this.props.login.form.firstName}
                errorText={this.errorFor("firstName")}
                touched={this.state.touched.firstName}
                name="firstName"
                submit={this.state.submit}
              />
            </div>
            <div className="form__input-group">
              <FormInput
                handleChange={this.handleInput}
                handleBlur={this.handleBlur}
                handleFocus={this.handleFocus}
                placeholder="Last name"
                autoComplete="family-name"
                showError={this.state.showFieldErrors.lastName}
                value={this.props.login.form.lastName}
                errorText={this.errorFor("lastName")}
                touched={this.state.touched.lastName}
                name="lastName"
                submit={this.state.submit}
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
                showError={this.state.showFieldErrors.email}
                value={this.props.login.form.email}
                errorText={this.errorFor("email")}
                touched={this.state.touched.email}
                name="email"
                inputRef={el => (this.emailInput = el)}
                submit={this.state.submit}
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
                showError={this.state.showFieldErrors.password}
                value={this.props.login.form.password}
                errorText={this.errorFor("password")}
                touched={this.state.touched.password}
                name="password"
                submit={this.state.submit}
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
                showError={this.state.showFieldErrors.confirmPwd}
                value={this.props.login.form.confirmPwd}
                errorText={this.errorFor("confirmPwd")}
                touched={this.state.touched.confirmPwd}
                name="confirmPwd"
                submit={this.state.submit}
              />
            </div>
            <div className="form__input-group">
              <div className="form__button-wrap">
                <button
                  className={`form__button ${buttonState}`}
                  id="btn-register"
                  type="button"
                  onClick={() => this.register()}
                  disabled={this.state.showFormErrors}
                >
                  Create account
                </button>
              </div>
            </div>
            <div className="form__input-group">
              <div className={errorClass}>{this.props.register.errorMsg}</div>
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
    errorMsg: PropTypes.string,
    spinnerClass: PropTypes.string,
    modal: PropTypes.shape({
      class: PropTypes.string,
      text: PropTypes.string,
      title: PropTypes.string
    })
  }).isRequired,
  actions: PropTypes.shape({
    dismissModal: PropTypes.func,
    setFormField: PropTypes.func,
    setFormError: PropTypes.func,
    clearFormError: PropTypes.func
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
