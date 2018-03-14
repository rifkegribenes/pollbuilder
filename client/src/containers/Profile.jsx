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
  componentDidMount() {
    // get user id and token
    let userId;
    let token;
    // check for facebook redirect hash
    if (window.location.hash === "#_=_") {
      console.log("found facebook callback hash");
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
    // the URL. there is probably a better way to do this but idk what it is...
    // also set Validated to true since email has been validated by social auth
    if (this.props.match && this.props.match.params.id) {
      userId = this.props.match.params.id;
      token = this.props.match.params.token;
      this.props.actions.setLoggedIn(true);
      window.history.replaceState(null, null, `${window.location.origin}/user`);
    } else {
      // if they're not in the route params
      // then they've already been saved to redux store or local storage;
      // look for them there
      userId =
        this.props.profile.user._id ||
        JSON.parse(window.localStorage.getItem("userId"));
      console.log(`userId: ${userId}`);
      token =
        this.props.appState.authToken ||
        this.props.profile.token ||
        JSON.parse(window.localStorage.getItem("authToken"));
    }

    // if logged in through social auth, need to save them to local storage
    window.localStorage.setItem("authToken", JSON.stringify(token));
    window.localStorage.setItem("userId", JSON.stringify(userId));

    // retrieve profile & save to app state
    this.props.api.getProfile(token, userId).then(result => {
      if (result.type === "GET_PROFILE_SUCCESS") {
        console.log(`validated: ${this.props.profile.user.validated}`);
      }
    });
  }

  render() {
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
          <div className="profile">
            <div className="profile__row">
              <div className="profile__card">
                <div className="profile__header">Profile</div>
                <div className="profile__name">
                  {this.props.profile.user.profile.firstName}{" "}
                  {this.props.profile.user.profile.lastName}
                </div>
                <div className="profile__email">
                  {this.props.profile.user.profile.email}
                </div>
                <div className="profile__pic">
                  <img
                    src={this.props.profile.user.profile.avatarUrl}
                    alt={`${this.props.profile.user.profile.firstName} ${
                      this.props.profile.user.profile.lastName
                    }`}
                  />
                </div>
                <div className="profile__email">
                  {this.props.profile.user.validated && "Validated"}
                </div>
              </div>
              <div className="profile__card">
                <div className="profile__header">Local</div>
                {this.props.profile.user.local && (
                  <div className="profile__email">
                    {this.props.profile.user.local.email}
                  </div>
                )}
              </div>
              <div className="profile__card">
                <div className="profile__header">Github</div>
                {this.props.profile.user.github && (
                  <div className="profile__email">
                    {this.props.profile.user.github.email}
                    <br />
                    {`${this.props.profile.user.github.token.slice(0, 5)}...`}
                  </div>
                )}
              </div>
              <div className="profile__card">
                <div className="profile__header">Facebook</div>
                {this.props.profile.user.facebook && (
                  <div className="profile__email">
                    {this.props.profile.user.facebook.email}
                    <br />
                    {`${this.props.profile.user.facebook.token.slice(0, 5)}...`}
                  </div>
                )}
              </div>
              <div className="profile__card">
                <div className="profile__header">Google+</div>
                {this.props.profile.user.google && (
                  <div className="profile__email">
                    {this.props.profile.user.google.email}
                    <br />
                    {`${this.props.profile.user.google.token.slice(0, 5)}...`}
                  </div>
                )}
              </div>
            </div>
            <div className="form__input-group">
              <hr className="form__hr" />
              <div className="form__text">Connect with&hellip;</div>
              <div className="form__button-wrap">
                {!this.props.profile.user.github ||
                !this.props.profile.user.github.token ? (
                  <a
                    className="form__button form__button--github"
                    href="http://localhost:8080/api/auth/github/"
                    id="btn-github"
                  >
                    <span>Link GH</span>
                  </a>
                ) : (
                  ""
                )}
                {!this.props.profile.user.facebook ||
                !this.props.profile.user.facebook.token ? (
                  <a
                    className="form__button form__button--facebook"
                    id="btn-facebook"
                    href="http://localhost:8080/api/auth/facebook"
                  >
                    <span>Link FB</span>
                  </a>
                ) : (
                  ""
                )}
                {!this.props.profile.user.google ||
                !this.props.profile.user.google.token ? (
                  <a
                    className="form__button form__button--google"
                    id="btn-google"
                    href="http://localhost:8080/api/auth/google"
                  >
                    <span>Link G+</span>
                  </a>
                ) : (
                  ""
                )}
              </div>
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
                to view user profiles.
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
