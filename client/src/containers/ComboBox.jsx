import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";

import SocialAuth from "./SocialAuth";
import LocalLogin from "./LocalLogin";
import * as Actions from "../store/actions";

import envIcon from "../img/envelope.svg";
import logo from "../img/bot-head_340.png";

class ComboBox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      form: props.initalForm || "login",
      localForm: false
    };

    this.toggleForm = this.toggleForm.bind(this);
    this.toggleLocalForm = this.toggleLocalForm.bind(this);
  }

  componentDidMount() {}

  toggleForm(form) {
    const newState = { ...this.state };
    newState.form = form;
    newState.localForm = false;
    this.setState({ ...newState }, () => {});
  }

  toggleLocalForm(display) {
    const newState = { ...this.state };
    if (display !== true && display !== false) {
      newState.localForm = !this.state.localForm;
    } else {
      newState.localForm = display;
    }
    this.setState({ ...newState }, () => {});
  }

  /* Function login - Perform basic validation:
  * - username is at least 1 char
  * - password is at least 1 char
  * If valid, call the login route; store token in redux,
  * clear password from state, return to Home
  */
  // login() {
  //   const { email, password } = this.props.login.form;

  //   // show validation errors
  //   const newState = { ...this.state };
  //   newState.submit = true;
  //   newState.showFormErrors = true;

  //   const validationErrors = run(this.props.login.form, fieldValidations.login);

  //   if (!document.getElementById("email").validity.valid) {
  //     validationErrors.email = "Please enter a valid email address";
  //   }

  //   newState.validationErrors = { ...validationErrors };
  //   this.setState({ ...newState });

  //   if (email && password) {
  //     const body = { email, password };
  //     this.props.api.login(body).then(result => {
  //       if (result.type === "LOGIN_SUCCESS") {
  //         this.props.history.push("/");
  //       }
  //     });
  //   } else if (!document.getElementById("email").validity.valid) {
  //     console.log("invalid email");
  //     this.props.actions.setFormError("Invalid email address");
  //   } else if (!email) {
  //     this.props.actions.setFormError("Email cannot be blank");
  //   } else if (!password) {
  //     this.props.actions.setFormError("Password cannot be blank");
  //   } else {
  //     this.props.actions.setFormError("Please complete all required fields");
  //   }
  // }

  // /* Function register - Perform basic validation:
  // * - username is at least 1 char
  // * - password is at least 1 char
  // * - password confirmation matches
  // * If valid, call the register route; store token in redux, clear password
  // * from state, return to Home
  // */
  // register() {
  //   const {
  //     firstName,
  //     lastName,
  //     email,
  //     password,
  //     confirmPwd
  //   } = this.props.login.form;

  //   // show validation errors
  //   const newState = { ...this.state };
  //   newState.submit = true;
  //   newState.showFormErrors = true;

  //   const validationErrors = run(
  //     this.props.login.form,
  //     fieldValidations.signup
  //   );
  //   newState.validationErrors = { ...validationErrors };
  //   this.setState({ ...newState });

  //   if (!Object.values(this.state.validationErrors).length) {
  //     const body = { firstName, lastName, email, password };
  //     this.props.api
  //       .registration(body)
  //       .then(result => {
  //         if (result.type === "REGISTRATION_FAILURE") {
  //           const newState = { ...this.state };
  //           newState.submit = true;
  //           newState.showFormErrors = true;
  //           this.setState({ ...newState });
  //         }
  //         if (result.type === "REGISTRATION_SUCCESS") {
  //           // clear form
  //           this.props.actions.setFormField({
  //             firstName: "",
  //             lastName: "",
  //             email: "",
  //             password: "",
  //             confirmPwd: "",
  //             error: ""
  //           });
  //           // this.props.history.push("/");
  //         }
  //       })
  //       .catch(err => {
  //         let error;
  //         typeof err === "string"
  //           ? (error = err)
  //           : typeof err.message === "string"
  //             ? (error = err.message)
  //             : (error = undefined);
  //         console.log(error);
  //         this.props.actions.setFormError(error);
  //         this.props.actions.setFormField({
  //           error: err
  //         });
  //         // show validation errors
  //         const newState = { ...this.state };
  //         newState.showFormErrors = true;
  //         this.setState({ ...newState });
  //       });
  //   } else if (!email) {
  //     this.props.actions.setFormError("Email cannot be blank");
  //   } else if (password !== confirmPwd) {
  //     this.props.actions.setFormError("Passwords do not match");
  //   } else if (!firstName || !lastName) {
  //     this.props.actions.setFormError("Full name is required");
  //   } else {
  //     this.props.actions.setFormError("Please complete the form");
  //   }
  // }

  // reset() {
  //   const email = this.props.login.form.email;
  //   if (!email) {
  //     this.props.actions.setFormError("Email required to reset password");
  //   } else {
  //     this.props.api.sendResetEmail({ email });
  //   }
  // }

  // resetPwd() {
  //   this.props.actions.setFormError({ message: "" });
  //   const key = this.props.match.params.key;
  //   const { password, confirmPwd } = this.props.login.form;

  //   // show validation errors
  //   const newState = { ...this.state };
  //   newState.submit = true;
  //   // newState.showFormErrors = true;

  //   const validationErrors = run(
  //     this.props.login.form,
  //     fieldValidations.resetPwd
  //   );

  //   newState.validationErrors = { ...validationErrors };
  //   this.setState({ ...newState });

  //   // validate form data
  //   if (password && password === confirmPwd) {
  //     const body = {
  //       password,
  //       key
  //     };
  //     this.props.api.resetPassword(body).then(result => {
  //       if (result === "RESET_PW_SUCCESS") {
  //         const newState = { ...this.state };
  //         newState.success = true;
  //         this.setState({ ...newState }, () => {
  //           console.log(`success: ${this.state.success}`);
  //         });
  //       }
  //     });
  //   } else {
  //     if (!password) {
  //       this.props.actions.setFormError({
  //         message: "Password is required"
  //       });
  //     }
  //     if (password !== confirmPwd) {
  //       this.props.actions.setFormError({
  //         message: "Passwords do not match"
  //       });
  //     }
  //   }
  // }

  render() {
    const login = this.state.form === "login";
    const signup = this.state.form === "signup";
    const reset = this.state.form === "reset";
    const resetPwd = this.state.form === "resetPwd";
    const { localForm } = this.state;
    const buttonText = login
      ? "Log In"
      : signup ? "Sign Up" : resetPwd ? "Reset Password" : "Send Email";
    return (
      <div className="container combo">
        <div className="combo__header">
          {reset && (
            <button
              className="combo__back-btn"
              onClick={() => this.toggleForm("login")}
            >
              <span className="sr-only">Back to Login</span>
              &lsaquo;
            </button>
          )}
          <div className="combo__logo-wrap">
            <img className="combo__logo" src={logo} alt="surveybot" />
          </div>
          <div className="combo__title">
            {reset || resetPwd ? "Reset your password" : ""}
          </div>
        </div>
        {!(reset || resetPwd) && (
          <div className="combo__nav">
            <button
              className={
                login
                  ? "combo__nav-button combo__nav-button--active"
                  : "combo__nav-button"
              }
              onClick={() => this.toggleForm("login")}
            >
              Log in
            </button>
            <button
              className={
                signup
                  ? "combo__nav-button combo__nav-button--active"
                  : "combo__nav-button"
              }
              onClick={() => this.toggleForm("signup")}
            >
              Sign Up
            </button>
          </div>
        )}
        {!(reset || resetPwd) && (
          <SocialAuth
            setSpinner={this.props.actions.setSpinner}
            toggleLocalForm={this.toggleLocalForm}
            buttonText={buttonText}
          />
        )}
        <div className="combo__form">{login && <LocalLogin />}</div>
      </div>
    );
  }
}

ComboBox.propTypes = {
  actions: PropTypes.shape({
    dismissModal: PropTypes.func,
    setFormField: PropTypes.func,
    setFormError: PropTypes.func,
    clearFormError: PropTypes.func
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      key: PropTypes.string
    })
  }).isRequired
};

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch)
});

export default withRouter(connect(mapDispatchToProps)(ComboBox));
