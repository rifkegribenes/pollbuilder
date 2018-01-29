import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import * as Actions from "../store/actions";
import * as apiActions from "../store/actions/apiActions";

class Login extends React.Component {
  /* Function handleLogin - Perform basic validation:
  * - username is at least 1 char
  * - password is at least 1 char
  * If valid, call the login route; store token in redux, clear password from state
  * , return to Home
  */
  login(strategy) {
    // clear previous errors
    this.props.actions.setLoginError("");
    switch (strategy) {
      case "local":
        const email = this.props.login.loginEmail;
        const password = this.props.login.loginPassword;
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
        break;
      case "github":
        this.props.api.loginGithub().then(result => {
          if (result.type === "GITHUB_LOGIN_SUCCESS") {
            this.props.history.push("/");
          }
        });
        break;
      case "facebook":
        break;
      case "twitter":
        break;
      case "google":
        break;
      default:
    }
  }

  /*
  * Function: handleInput - On Change to the inputs, send updated value to redux store
  * @param {object} event - the change event triggered by the input.  All form inputs will
  *   use this handler; trigger the proper action based on the input ID
  */
  handleInput(event) {
    switch (event.target.id) {
      case "email":
        this.props.actions.setLoginEmail(event.target.value);
        break;
      case "password":
        this.props.actions.setLoginPwd(event.target.value);
        break;
      default:
        break;
    }
    if (event.which === 13) {
      this.handleLogin();
    }
  }

  render() {
    const errorClass = this.props.login.errorMsg ? "error" : "hidden";
    return (
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
                onClick={() => this.login("local")}
              >
                Sign In
              </button>
            </div>
          </div>
          <div className="form__input-group">
            <Link className="form__login-link" to="/register">
              Create new account
            </Link>
          </div>
          <div className="form__input-group">
            <hr className="form__hr" />
            <div className="form__text">Or log in with&hellip;</div>
            <div className="form__button-wrap">
              <button
                className="form__button form__button--github"
                id="btn-github"
                onClick={() => this.login("github")}
              >
                <span className="sr-only">Github</span>
              </button>
              <button
                className="form__button form__button--facebook"
                id="btn-facebook"
                onClick={() => this.login("facebook")}
              >
                <span className="sr-only">Facebook</span>
              </button>
              <button
                className="form__button form__button--twitter"
                id="btn-twitter"
                onClick={() => this.login("twitter")}
              >
                <span className="sr-only">form__button--twitter</span>
              </button>
              <button
                className="form__button form__button--google"
                id="btn-google"
                onClick={() => this.login("google")}
              >
                <span className="sr-only">Google</span>
              </button>
            </div>
          </div>
          <div className="form__input-group">
            <div className={errorClass}>{this.props.login.errorMsg}</div>
          </div>
        </div>
      </form>
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
    errorMsg: PropTypes.string
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

export default connect(mapStateToProps, mapDispatchToProps)(Login);
