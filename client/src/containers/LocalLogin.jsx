import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";

import Form from "./Form";
import * as Actions from "../store/actions";
import * as apiActions from "../store/actions/apiActions";
import { fieldValidations, run, validateEmail } from "../utils/";

class LocalLogin extends React.Component {
  constructor(props) {
    super(props);

    this.login = this.login.bind(this);
  }

  componentDidMount() {}

  /* Function login - Perform basic validation:
  * - username is at least 1 char
  * - password is at least 1 char
  * If valid, call the login route; store token in redux,
  * clear password from state, return to Home
  */
  login() {
    const { email, password } = this.props.auth.form;

    // show validation errors
    this.props.actions.showFormError();
    this.props.actions.setSubmit();

    const vErrors = run(this.props.auth.form, fieldValidations.login);
    const validationErrors = validateEmail(vErrors);

    this.props.actions.setValidationErrors(validationErrors);

    if (email && password) {
      const body = { email, password };
      this.props.api.login(body).then(result => {
        const { authToken } = this.props.appState;
        const { _id } = this.props.profile.user;
        if (result.type === "LOGIN_SUCCESS") {
          this.props.history.push(`/profile/${_id}/${authToken}`);
        }
      });
    } else {
      this.props.actions.setFormError("Please complete all required fields");
    }
  }

  render() {
    const fields = [
      {
        name: "email",
        label: "Email",
        autoComplete: "email",
        type: "email",
        placeholder: "Email"
      },
      {
        name: "password",
        label: "Password",
        autoComplete: "current-password",
        type: "password",
        placeholder: "Password"
      }
    ];
    return (
      <Form
        fields={fields}
        reducer="auth"
        form="login"
        buttonText="Log in"
        formAction={this.login}
        toggleForm={this.props.toggleForm}
      />
    );
  }
}

LocalLogin.propTypes = {
  actions: PropTypes.shape({
    showFormError: PropTypes.func,
    setSubmit: PropTypes.func,
    setValidationErrors: PropTypes.func,
    setFormError: PropTypes.func
  }).isRequired,
  api: PropTypes.shape({
    login: PropTypes.func
  }).isRequired,
  auth: PropTypes.shape({
    form: PropTypes.shape({
      email: PropTypes.string,
      password: PropTypes.string
    }).isRequired
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func
  }).isRequired,
  toggleForm: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  appState: state.appState,
  profile: state.profile
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch),
  api: bindActionCreators(apiActions, dispatch)
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(LocalLogin)
);
