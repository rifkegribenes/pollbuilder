import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";

import {
  refreshToken,
  resetValidateModal,
  validateToken
} from "../store/actions/apiActions";
import { setLoginError, setRedirectUrl } from "../store/actions";
import Spinner from "./Spinner";
import ModalSm from "./ModalSm";

class Validate extends React.Component {
  /*
  * If already logged in, refresh the token, then display the success message
  * If not logged in, try to validate the localStorage token
  * If localStorage fails, force login with a specific message
  */
  componentDidMount() {
    console.log("Validate component");
    if (this.props.appState.loggedIn) {
      console.log("Validate component: Logged in");
      this.props.api.refreshToken(this.props.appState.authToken);
      this.props.actions.setRedirectUrl("");
    } else {
      console.log("Validate component: JWT authenticating");
      let token = window.localStorage.getItem("authToken");
      if (token && token !== "undefined") {
        token = JSON.parse(token);
        const user = JSON.parse(window.localStorage.getItem("userId"));
        // If we validate successfully, look for redirect_url and follow it
        this.props.api.refreshToken(token, user).then(result => {
          if (result.type === "REFRESH_TOKEN_SUCCESS") {
            this.props.actions.setRedirectUrl("");
          }
          if (result.type === "REFRESH_TOKEN_FAILURE") {
            this.props.actions.setLoginError(
              "You must log in to validate your account"
            );
            this.props.history.push("/login");
          }
        });
      } else {
        console.log("Validate component: Not logged in");
        this.props.actions.setLoginError(
          "You must log in to validate your account"
        );
        this.props.history.push("/login");
      }
    }
  }

  render() {
    let valStatus;
    if (this.props.login.tokenRefreshComplete === undefined) {
      valStatus = "Validating...";
    } else if (!this.props.login.tokenRefreshComplete) {
      valStatus = "Validation Failed";
    } else {
      valStatus = "Welcome!";
    }
    return (
      <div className="container validate">
        <h2 className="title">{valStatus}</h2>
        {this.props.login.tokenRefreshComplete && (
          <div className="validate__text-wrap">
            <div className="validate__text-header">
              {`Congratulations ${this.props.profile.user.profile.firstName}!`}
            </div>
            <div className="validate__text">
              <p>Your account is now validated.</p>
            </div>
          </div>
        )}
        <Spinner cssClass={this.props.login.spinnerClass} />
        <ModalSm
          modalClass={this.props.login.modal.class}
          modalTitle={this.props.login.modal.title}
          modalText={this.props.login.modal.text}
          modalType={this.props.login.modal.type}
          dismiss={() => {
            this.props.api.resetValidateModal({
              class: "modal__hide",
              text: "",
              type: "",
              title: ""
            });
          }}
        />
      </div>
    );
  }
}

Validate.propTypes = {
  appState: PropTypes.shape({
    authToken: PropTypes.string,
    loggedIn: PropTypes.boolean
  }).isRequired,
  profile: PropTypes.shape({
    user: PropTypes.shape({
      profile: PropTypes.shape({
        firstName: PropTypes.string
      }).isRequired
    }).isRequired
  }).isRequired,
  login: PropTypes.shape({
    spinnerClass: PropTypes.string,
    tokenRefreshComplete: PropTypes.boolean,
    modal: PropTypes.shape({
      class: PropTypes.string,
      type: PropTypes.string,
      title: PropTypes.string,
      text: PropTypes.string
    })
  }).isRequired,
  api: PropTypes.shape({
    refreshToken: PropTypes.func,
    resetValidateModal: PropTypes.func,
    validateToken: PropTypes.func
  }).isRequired,
  actions: PropTypes.shape({
    setLoginError: PropTypes.func,
    setRedirectUrl: PropTypes.func
  }).isRequired
};

const mapStateToProps = state => ({
  appState: state.appState,
  profile: state.profile,
  login: state.login
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ setLoginError, setRedirectUrl }, dispatch),
  api: bindActionCreators(
    { refreshToken, resetValidateModal, validateToken },
    dispatch
  )
});

export default connect(mapStateToProps, mapDispatchToProps)(Validate);
