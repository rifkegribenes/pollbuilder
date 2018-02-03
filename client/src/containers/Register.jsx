import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";

import * as Actions from "../store/actions";
import * as apiActions from "../store/actions/apiActions";

class Register extends React.Component {
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
    const { email, password, confirmPwd } = this.props.login.form;

    if (email && password === confirmPwd) {
      const body = { email, password };
      this.props.api
        .register(body)
        .then(result => {
          if (result.type === "REGISTRATION_FAILURE") {
            this.setState({ error: true });
          }
          if (result.type === "REGISTRATION_SUCCESS") {
            // clear form
            this.props.actions.setFormField({
              email: "",
              password: "",
              confirmPwd: "",
              error: ""
            });
            this.props.history.push("/");
          }
        })
        .catch(err => {
          console.log(err.response.data.message);
          console.log(err);
          this.props.actions.setRegError(err.response.data.message);
          this.props.actions.setFormField({
            error: err.response.data.message
          });
        });
    } else if (!email) {
      console.log("Email cannot be blank");
      this.props.actions.setRegError("Email cannot be blank");
    } else if (password !== confirmPwd) {
      console.log("Passwords do not match");
      this.props.actions.setRegError("Passwords do not match");
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
  handleInput(event) {
    this.props.actions.setFormField(event.target.id, event.target.value);
    if (event.which === 13) {
      this.handleRegister();
    }
  }

  render() {
    const errorClass =
      this.props.register.regErrorMsg || this.props.login.form.error
        ? "error"
        : "hidden";
    return (
      <form className="container form">
        <div className="form__body">
          <div className="form__header">Create new Account</div>
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
              value={this.props.login.form.email}
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
              autoComplete="new-password"
              id="password"
              value={this.props.login.form.password}
              onChange={event => this.handleInput(event)}
            />
          </div>
          <div className="form__input-group">
            <label htmlFor="confirmPwd" className="form__label">
              Confirm Password
            </label>
            <input
              className="form__input"
              type="password"
              placeholder="Confirm Password"
              autoComplete="new-password"
              id="confirmPwd"
              value={this.props.login.form.confirmPwd}
              onChange={event => this.handleInput(event)}
              required
            />
          </div>
          <div className="form__input-group">
            <div className="form__button-wrap">
              <button
                className="form__button pointer"
                id="btn-register"
                onClick={() => this.handleRegister()}
              >
                Create account
              </button>
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
                href="http://localhost:8080/auth/github/"
                id="btn-github"
              >
                <span className="sr-only">Github</span>
              </a>
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
            <div className={errorClass}>{this.props.register.regErrorMsg}</div>
          </div>
        </div>
      </form>
    );
  }
}

Register.propTypes = {
  api: PropTypes.shape({
    register: PropTypes.func
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
    dismissRegModal: PropTypes.func
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
