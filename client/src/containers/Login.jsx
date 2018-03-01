import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";

import * as Actions from "../store/actions";
import * as apiActions from "../store/actions/apiActions";

import Spinner from "./Spinner";
import ModalSm from "./ModalSm";

class Login extends React.Component {
  componentDidMount() {}

  /* Function login - Perform basic validation:
  * - username is at least 1 char
  * - password is at least 1 char
  * If valid, call the login route; store token in redux, clear password from state
  * , return to Home
  */
  login() {
    // clear previous errors
    this.props.actions.clearLoginError();
    const { email, password } = this.props.login.form;
    if (email && password) {
      const body = { email, password };
      this.props.api.login(body).then(result => {
        if (result.type === "LOGIN_SUCCESS") {
          this.props.history.push("/");
        }
      });
    } else if (!email) {
      this.props.actions.setLoginError("Email cannot be blank");
    } else if (!password) {
      this.props.actions.setLoginError("Password cannot be blank");
    }
  }

  resetPassword() {
    const email = this.props.login.form.email;
    if (!email) {
      this.props.actions.setLoginError("Email required to reset password");
    } else {
      this.props.api.sendResetEmail({ email });
    }
  }

  /*
  * Function: handleInput - On Change, send updated value to redux
  * @param {object} event - the change event triggered by the input.
  * All form inputs will use this handler; trigger the proper action
  * based on the input ID
  */
  handleInput(event) {
    this.props.actions.setFormField(event.target.id, event.target.value);
    if (event.which === 13) {
      this.login();
    }
  }

  render() {
    const errorClass = this.props.login.errorMsg ? "error" : "hidden";
    return (
      <div>
        <Spinner cssClass={this.props.login.spinnerClass} />
        <ModalSm
          modalClass={this.props.login.modal.class}
          modalText={this.props.login.modal.text}
          modalType="modal__info"
          modalTitle={this.props.login.modal.title}
          dismiss={() => {
            this.props.actions.dismissRegModal();
          }}
          action={() => {
            this.props.actions.dismissRegModal();
            this.props.history.push("/");
          }}
        />
        <form className="container form">
          <div className="form__body">
            <div className="form__header">Sign In</div>
            <div className="form__input-group">
              <label htmlFor="username" className="form__label">
                Email
              </label>
              <input
                className="form__input"
                type="email"
                placeholder="Email"
                autoComplete="email"
                id="email"
                onChange={event => this.handleInput(event)}
              />
            </div>
            <div className="form__input-group">
              <label htmlFor="username" className="form__label">
                Password
              </label>
              <input
                className="form__input"
                type="password"
                placeholder="Password"
                autoComplete="current-password"
                id="password"
                onChange={event => this.handleInput(event)}
              />
            </div>
            <div className="form__input-group">
              <div className="form__button-wrap">
                <button
                  className="form__button pointer"
                  id="btn-login"
                  onClick={() => this.login()}
                  type="button"
                >
                  Sign In
                </button>
              </div>
            </div>
            <div className="form__input-group  form__link-group">
              <button
                className="form__login-link"
                type="button"
                onClick={() => this.resetPassword()}
              >
                Reset Password
              </button>
              <Link className="form__login-link" to="/register">
                Create new account
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
            <div className="form__input-group">
              <div className={errorClass}>{this.props.login.errorMsg}</div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

Login.propTypes = {
  appState: PropTypes.shape({
    spinnerClass: PropTypes.string,
    modal: PropTypes.shape({
      class: PropTypes.string,
      text: PropTypes.string,
      title: PropTypes.string
    })
  }).isRequired,
  actions: PropTypes.shape({
    setLoginError: PropTypes.func,
    setLoginUser: PropTypes.func,
    setLoginPwd: PropTypes.func,
    dismissLoginModal: PropTypes.func
  }).isRequired,
  api: PropTypes.shape({
    login: PropTypes.func
  }).isRequired,
  login: PropTypes.shape({
    loginEmail: PropTypes.string,
    loginPassword: PropTypes.string,
    errorMsg: PropTypes.string,
    spinnerClass: PropTypes.string,
    modal: PropTypes.shape({
      class: PropTypes.string,
      text: PropTypes.string,
      title: PropTypes.string
    })
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func
  }).isRequired
};

const mapStateToProps = state => ({
  appState: state.appState,
  login: state.login
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch),
  api: bindActionCreators(apiActions, dispatch)
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));
