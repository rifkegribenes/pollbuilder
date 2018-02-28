import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import Spinner from "./Spinner";
import ModalSm from "./ModalSm";
import * as Actions from "../store/actions";
import * as apiActions from "../store/actions/apiActions";

class ResetPassword extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      confirmPwd: "",
      error: false,
      errorMsg: ""
    };
  }

  handleReset = () => {
    const key = this.props.match.params.key;
    const { email, password, confirmPwd } = this.state;
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
        this.setState({
          error: true,
          errorMsg: "Email is required"
        });
      }
      if (!password) {
        this.setState({
          error: true,
          errorMsg: "Password is required"
        });
      }
      if (!password === confirmPwd) {
        this.setState({
          error: true,
          errorMsg: "Passwords do not match"
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
    const showError = this.state.error ? "" : "form__hidden";
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
              onChange={event => this.handleInput(event)}
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
              onChange={event => this.handleInput(event)}
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
              onChange={event => this.handleInput(event)}
              required
            />
          </div>
          <div className="form__input-group">
            <div className={`form__error ${showError}`}>
              {this.state.errorMsg}
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
          modalTitle="RESET PASSWORD"
          modalType={this.props.login.modal.type}
          dismiss={() => {
            this.props.actions.dismissPWResetModal();
          }}
        />
      </div>
    );
  }
}

ResetPassword.propTypes = {
  actions: PropTypes.shape({
    dismissPWResetModal: PropTypes.func
  }).isRequired,
  api: PropTypes.shape({
    resetPassword: PropTypes.func
  }).isRequired,
  login: PropTypes.shape({
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
