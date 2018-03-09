import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";

import Spinner from "./Spinner";
import ModalSm from "./ModalSm";
import Login from "./Login";
import Register from "./Register";
import ResetPassword from "./ResetPassword";
import { fieldValidations, run } from "../utils/";
import * as Actions from "../store/actions";
import * as apiActions from "../store/actions/apiActions";

class ComboBox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      form: login
    };

    this.toggleForm = this.toggleForm.bind(this);
  }

  toggleForm(form) {
    const newState = { ...this.state };
    newState.form = form;
    this.setState({ ...newState });
  }

  render() {
    return (
      <div className="container combo">
        <div className="combo__header">
          <div className="combo__logo-wrap">
            <img className="combo__logo" src="" alt="" />
          </div>
          <div className="combo__title">
            {this.state.form === "reset" ? "Reset your password" : "Voting App"}
          </div>
        </div>
        {this.state.form !== "reset" && (
          <div className="combo__nav">
            <button
              className="combo__nav-button"
              onClick={() => this.toggleForm("login")}
            >
              Log in
            </button>
            <button
              className="combo__nav-button"
              onClick={() => this.toggleForm("signup")}
            >
              Sign Up
            </button>
          </div>
        )}
        <div className="combo__form">
          {this.state.form === "login" && <Login />}
          {this.state.form === "signup" && <Register />}
          {this.state.form === "reset" && <ResetPassword />}
        </div>
        <Spinner cssClass={this.props.login.spinnerClass} />
        <ModalSm
          modalClass={this.props.login.modal.class}
          modalText={this.props.login.modal.text}
          modalTitle={
            this.props.login.modal.type === "modal__success"
              ? "RESET PASSWORD SUCCESS"
              : "RESET PASSWORD FAILURE"
          }
          modalType={this.props.login.modal.type}
          buttonText={
            this.props.login.modal.type === "modal__success"
              ? "Sign In"
              : "Continue"
          }
          dismiss={() => {
            this.props.actions.dismissModal();
            this.props.history.push("/login");
          }}
        />
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
  api: PropTypes.shape({
    resetPassword: PropTypes.func
  }).isRequired,
  login: PropTypes.shape({
    form: PropTypes.shape({
      email: PropTypes.string,
      password: PropTypes.string,
      confirmPwd: PropTypes.string
    }).isRequired,
    modal: PropTypes.shape({
      class: PropTypes.string,
      text: PropTypes.string,
      title: PropTypes.string
    }).isRequired,
    spinnerClass: PropTypes.string
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      key: PropTypes.string
    })
  }).isRequired
};

const mapStateToProps = state => ({
  login: state.login
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch),
  api: bindActionCreators(apiActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ComboBox);
