import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";

import Form from "./Form";
import * as Actions from "../store/actions";
import * as apiActions from "../store/actions/apiActions";
import { fieldValidations, run, validateEmail } from "../utils/";

class LocalSignup extends React.Component {
  constructor(props) {
    super(props);

    this.register = this.register.bind(this);
  }

  componentDidMount() {}

  /* Function register - Perform basic validation:
  * - username is at least 1 char
  * - password is at least 1 char
  * - password confirmation matches
  * If valid, call the register route; store token in redux, clear password
  * from state, return to Home
  */
  register() {
    const { firstName, lastName, email, password } = this.props.auth.form;

    // show validation errors
    this.props.actions.showFormError();
    this.props.actions.setSubmit();

    const vErrors = run(this.props.auth.form, fieldValidations.signup);
    const validationErrors = validateEmail(vErrors);

    this.props.actions.setValidationErrors(validationErrors);

    if (!Object.values(this.props.auth.form.validationErrors).length) {
      const body = { firstName, lastName, email, password };
      this.props.api
        .registration(body)
        .then(result => {
          if (result.type === "REGISTRATION_FAILURE") {
            console.log('registration failure');
            this.props.actions.showFormError();
            this.props.actions.setSubmit();
          }
        })
        .catch(err => {
          let error;
          typeof err.message === "string"
            ? (error = err.message)
            : (error = undefined);
          console.log(error);
          this.props.actions.setFormError(error);
          this.props.actions.setFormField({
            error: err
          });
          // show validation errors
          this.props.actions.showFormError();
          this.props.actions.setSubmit();
        });
    } else {
      console.log(this.props.auth.form.validationErrors);
      this.props.actions.setFormError("Please complete the form");
    }
  }

  render() {
    const fields = [
      {
        name: "firstName",
        label: "First Name",
        autoComplete: "given-name",
        type: "text",
        placeholder: "First name"
      },
      {
        name: "lastName",
        label: "Last Name",
        autoComplete: "family-name",
        type: "text",
        placeholder: "Last name"
      },
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
        autoComplete: "new-password",
        type: "password",
        placeholder: "Password"
      },
      {
        name: "confirmPwd",
        label: "Confirm Password",
        autoComplete: "new-password",
        type: "password",
        placeholder: "Confirm Password"
      }
    ];
    return (
      <Form
        fields={fields}
        reducer="auth"
        form="signup"
        buttonText="Sign up"
        formAction={this.register}
        toggleForm={this.props.toggleForm}
      />
    );
  }
}

LocalSignup.propTypes = {
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
  connect(mapStateToProps, mapDispatchToProps)(LocalSignup)
);
