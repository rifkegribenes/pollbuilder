import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";

import Spinner from "./Spinner";
import ModalSm from "./ModalSm";
import * as Actions from "../store/actions";
import * as apiActions from "../store/actions/apiActions";

class ResetPassword extends React.Component {
  ComponentDidMount() {
    this.props.actions.clearLoginError();
  }

  handleReset = () => {
    console.log("handleReset");
    const key = this.props.match.params.key;
    console.log(key);
    const { email, password, confirmPwd } = this.props.login.form;
    console.log(password, confirmPwd);
    // validate form data
    if (email && password && password === confirmPwd) {
      const body = {
        email,
        password,
        key
      };
      this.props.api.resetPassword(body);
    } else {
      if (!email) {
        this.props.actions.setLoginError({
          message: "Email is required"
        });
      }
      if (!password) {
        this.props.actions.setLoginError({
          message: "Password is required"
        });
      }
      if (password !== confirmPwd) {
        this.props.actions.setLoginError({
          message: "Passwords do not match"
        });
      }
    }
  };
  /*
  * Function: handleInput - On Change to the inputs, send updated value to redux store
  * @param {object} event - the change event triggered by the input.  All form inputs will
  *   use this handler; trigger the proper action based on the input ID
  */
  handleInput(event) {
    this.setState({ [event.target.id]: event.target.value, error: false });
    if (event.which === 13) {
      this.handleReset();
    }
  }

  render() {
    const showError = this.props.login.errorMsg ? "" : "form__hidden";
    return (
      <div className="container form">
        <div className="form__body">
          <div className="form__header">Reset Password</div>
          <div className="form__input-group">
            <label htmlFor="email" className="form__label">
              Email
            </label>
            <input
              className="form__input"
              type="email"
              placeholder="Email"
              id="email"
              value={this.props.login.form.email}
              onChange={e =>
                this.props.actions.setFormField(e.target.id, e.target.value)
              }
              required
            />
          </div>
          <div className="form__input-group">
            <label htmlFor="password" className="form__label">
              Password
            </label>
            <input
              className="form__input"
              type="password"
              placeholder="Password"
              id="password"
              value={this.props.login.form.password}
              onChange={e =>
                this.props.actions.setFormField(e.target.id, e.target.value)
              }
              required
            />
          </div>
          <div className="form__input-group">
            <label htmlFor="username" className="form__label">
              Confirm password
            </label>
            <input
              className="form__input"
              type="password"
              placeholder="Confirm Password"
              id="confirmPwd"
              value={this.props.login.form.confirmPwd}
              onChange={e =>
                this.props.actions.setFormField(e.target.id, e.target.value)
              }
              required
            />
          </div>
          <div className="form__input-group">
            <div className={`form__error ${showError}`}>
              {this.props.login.errorMsg}
            </div>
          </div>
          <div className="form__input-group">
            <div className="form__button-wrap">
              <button
                className="form__button pointer"
                id="btn-reset"
                onClick={() => this.handleReset()}
              >
                Reset
              </button>
            </div>
          </div>
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

ResetPassword.propTypes = {
  actions: PropTypes.shape({
    dismissModal: PropTypes.func,
    setFormField: PropTypes.func,
    setLoginError: PropTypes.func,
    clearLoginError: PropTypes.func
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

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);
