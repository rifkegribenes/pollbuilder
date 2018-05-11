import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";

import Form from "./Form";
import * as Actions from "../store/actions";
import * as apiActions from "../store/actions/apiActions";
import { fieldValidations, run } from "../utils/";

class ResetPassword extends React.Component {
  constructor(props) {
    super(props);

    this.resetPwd = this.resetPwd.bind(this);
  }

  componentDidMount() {}

  resetPwd() {
    this.props.actions.setFormError({ message: "" });
    const key = this.props.match.params.key;
    const { password, confirmPwd } = this.props.auth.form;

    // show validation errors
    this.props.actions.showFormError();
    this.props.actions.setSubmit();

    const validationErrors = run(
      this.props.auth.form,
      fieldValidations.resetPwd
    );

    this.props.actions.setValidationErrors(validationErrors);

    // validate form data
    if (password && password === confirmPwd) {
      const body = {
        password,
        key
      };
      this.props.api.resetPassword(body).then(result => {
        if (result === "RESET_PW_SUCCESS") {
          this.props.history.push('/login');

        } else if (result === "RESET_PW_FAILURE") {

        }
      });
    } else {
      if (!password) {
        this.props.actions.setFormError({
          message: "Password is required"
        });
      }
      if (password !== confirmPwd) {
        this.props.actions.setFormError({
          message: "Passwords do not match"
        });
      }
    }
  }

  render() {
    const fields = [
      {
        name: "password",
        label: "Password",
        autoComplete: "new-password",
        type: "password",
        placeholder: "New Password"
      },
      {
        name: "confirmPwd",
        label: "Confirm Password",
        autoComplete: "new-password",
        type: "password",
        placeholder: "Confirm New Password"
      }
    ];
    return (
      <Form
        fields={fields}
        reducer="auth"
        form="resetPwd"
        buttonText="Reset Password"
        formAction={this.resetPwd}
        toggleForm={this.props.toggleForm}
      />
    );
  }
}

ResetPassword.propTypes = {
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
  }).isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch),
  api: bindActionCreators(apiActions, dispatch)
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ResetPassword)
);
