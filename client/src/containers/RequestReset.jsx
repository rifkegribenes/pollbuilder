import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";

import Form from "./Form";
import * as Actions from "../store/actions";
import * as apiActions from "../store/actions/apiActions";

class RequestReset extends React.Component {
  constructor(props) {
    super(props);

    this.reset = this.reset.bind(this);
  }

  componentDidMount() {}

  reset() {
    const email = this.props.auth.form.email;
    if (!email) {
      this.props.actions.setFormError("Email required to reset password");
    } else {
      this.props.api.sendResetEmail({ email });
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
      }
    ];
    return (
      <Form
        fields={fields}
        reducer="auth"
        form="reset"
        buttonText="Send Reset Link"
        formAction={this.reset}
        toggleForm={this.props.toggleForm}
      />
    );
  }
}

RequestReset.propTypes = {
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
  connect(mapStateToProps, mapDispatchToProps)(RequestReset)
);
