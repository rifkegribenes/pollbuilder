import React from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";
import * as Actions from "../store/actions";
import * as apiActions from "../store/actions/apiActions";

import Spinner from "./Spinner";
import ModalSm from "./ModalSm";

class Profile extends React.Component {
  componentWillMount() {
    // get user id and token
    let userId;
    let token;
    // check for facebook redirect hash
    if (window.location.hash === "#_=_") {
      this.props.actions.setLoggedIn();
      window.history.replaceState
        ? window.history.replaceState(
            null,
            null,
            window.location.href.split("#")[0]
          )
        : (window.location.hash = "");
    }
    // if landing on this page from a callback from social login,
    // the userid and token will be in the route params.
    // extract them to use in the api call, then strip them from
    // the URL, and hide the spinner.
    // there is probably a better way to do this but idk what it is...
    // also set Verified to true since email has been verified by social auth
    if (this.props.match && this.props.match.params.id) {
      userId = this.props.match.params.id;
      token = this.props.match.params.token;
      this.props.actions.setLoggedIn();
      window.history.replaceState(null, null, `${window.location.origin}/user`);
      this.props.actions.setSpinner("hide");
    } else {
      // if they're not in the route params
      // then they've already been saved to redux store or local storage;
      // look for them there
      userId =
        this.props.profile.user._id ||
        JSON.parse(window.localStorage.getItem("userId"));
      token =
        this.props.appState.authToken ||
        JSON.parse(window.localStorage.getItem("authToken"));
    }

    // if logged in for first time through social auth,
    // need to save them to local storage
    window.localStorage.setItem("authToken", JSON.stringify(token));
    window.localStorage.setItem("userId", JSON.stringify(userId));

    // retrieve user profile & save to app state
    this.props.api.getProfile(token, userId).then(result => {
      if (result.type === "GET_PROFILE_SUCCESS") {
      }
    });
  }

  render() {
    const backgroundStyle = {
      backgroundImage: `url(${this.props.profile.user.profile.avatarUrl})`,
      backgroundSize: "cover",
      backgroundPosition: "center center"
    };
    const body = { email: this.props.profile.user.profile.email };
    const modalObj = {
      text:
        "Please click below to resend a verification link to your email address",
      title: "Verify your email",
      buttonText: "Send message",
      action: () => this.props.api.resendVerificationLink(body)
    };
    return (
      <div>
        <Spinner cssClass={this.props.profile.spinnerClass} />
        <ModalSm
          modalClass={this.props.profile.modal.class}
          modalText={this.props.profile.modal.text}
          modalType={this.props.profile.modal.type}
          modalTitle={this.props.profile.modal.title}
          buttonText={this.props.profile.modal.buttonText}
          dismiss={() => {
            this.props.actions.dismissModal();
            if (this.props.profile.modal.type === "modal__error") {
              this.props.history.push("/login");
            }
          }}
          action={() => {
            this.props.actions.dismissModal();
            if (this.props.profile.modal.type === "modal__error") {
              this.props.history.push("/login");
            }
          }}
        />
        {this.props.appState.loggedIn ? (
          <div className="container profile">
            <div className="profile__card">
              <div className="profile__image-aspect">
                <div className="h-nav__image-crop">
                  <div
                    className="h-nav__image"
                    style={backgroundStyle}
                    role="img"
                    aria-label={`${this.props.profile.user.profile.firstName} ${
                      this.props.profile.user.profile.lastName
                    }`}
                  />
                </div>
              </div>
              <div className="profile__name">
                {this.props.profile.user.profile.firstName}{" "}
                {this.props.profile.user.profile.lastName}
              </div>
              <div className="profile__email">
                {this.props.profile.user.profile.email}
              </div>
              {!this.props.profile.user.verified && (
                <div>
                  <div className="profile__unverified">
                    This email is unverified.
                  </div>
                  <button
                    className="form__button"
                    onClick={() => this.props.actions.setModalInfo(modalObj)}
                  >
                    Verify Email
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="profile">
            <div className="modal modal__show">
              <div className="center">
                Please{" "}
                <Link className="link" to="/login">
                  log in
                </Link>{" "}
                to access your profile.
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

Profile.propTypes = {
  appState: PropTypes.shape({
    user: PropTypes.shape({
      _id: PropTypes.string
    })
  }).isRequired,
  actions: PropTypes.shape({
    setLoggedIn: PropTypes.func,
    dismissModal: PropTypes.func
  }).isRequired,
  api: PropTypes.shape({
    getProfile: PropTypes.func
  }).isRequired,
  profile: PropTypes.shape({
    user: PropTypes.shape({
      profile: PropTypes.shape({
        firstName: PropTypes.string,
        lastName: PropTypes.string,
        email: PropTypes.string,
        avatarUrl: PropTypes.string
      }).isRequired,
      local: PropTypes.shape({
        email: PropTypes.string
      }),
      facebook: PropTypes.shape({
        email: PropTypes.string,
        token: PropTypes.string
      }),
      github: PropTypes.shape({
        email: PropTypes.string,
        token: PropTypes.string
      }),
      google: PropTypes.shape({
        email: PropTypes.string,
        token: PropTypes.string
      })
    }),
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
  profile: state.profile
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch),
  api: bindActionCreators(apiActions, dispatch)
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Profile)
);
