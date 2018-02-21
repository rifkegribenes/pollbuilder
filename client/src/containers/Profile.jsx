import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as Actions from "../store/actions";
import * as apiActions from "../store/actions/apiActions";

class Profile extends React.Component {
  componentDidMount() {
    // get user id and token
    let userId;
    let token;
    // if landing on this page from a callback from social login,
    // the userid and token will be in the route params.
    // extract them to use in the api call, then strip them from
    // the URL. there is probably a better way to do this but idk what it is...
    if (this.props.match && this.props.match.params.id) {
      userId = this.props.match.params.id;
      token = this.props.match.params.token;
      window.history.replaceState(null, null, `${window.location.origin}/user`);
    } else {
      // if they're not in the route params
      // then they've already been saved to app state or local storage;
      // look for them there
      userId =
        this.props.appState.user._id ||
        JSON.parse(window.localStorage.getItem("userId"));
      token =
        this.props.appState.authToken ||
        JSON.parse(window.localStorage.getItem("authToken"));
    }

    // if logged in through social auth, need to save them to local storage
    window.localStorage.setItem("authToken", JSON.stringify(token));
    window.localStorage.setItem("userId", JSON.stringify(userId));

    // retrieve profile & save to app state
    this.props.api.getProfile(token, userId).then(result => {
      if (result.type === "GET_PROFILE_SUCCESS") {
        console.log(this.props.profile.user);
      }
    });
  }

  render() {
    return (
      <div className="profile">
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
        <div className="form__input-group">
          <hr className="form__hr" />
          <div className="form__text">Connect with&hellip;</div>
          <div className="form__button-wrap">
            {!this.props.profile.user.github ||
            !this.props.profile.user.github.token ? (
              <a
                className="form__button form__button--github"
                href="http://localhost:8080/api/auth/connect/github/"
                id="btn-github"
              >
                <span>Link GH</span>
              </a>
            ) : (
              <a
                className="form__button form__button--github"
                href="http://localhost:8080/api/auth/unlink/github/"
                id="btn-github"
              >
                <span>Unlink GH</span>
              </a>
            )}
            {!this.props.profile.user.facebook ||
            !this.props.profile.user.facebook.token ? (
              <a
                className="form__button form__button--facebook"
                id="btn-facebook"
                href="http://localhost:8080/api/auth/connect/facebook"
              >
                <span>Link FB</span>
              </a>
            ) : (
              <a
                className="form__button form__button--facebook"
                id="btn-facebook"
                href="http://localhost:8080/api/auth/unlink/facebook"
              >
                <span>Unlink FB</span>
              </a>
            )}
            {!this.props.profile.user.google ||
            !this.props.profile.user.google.token ? (
              <a
                className="form__button form__button--google"
                id="btn-google"
                href="http://localhost:8080/api/auth/connect/google"
              >
                <span>Link G+</span>
              </a>
            ) : (
              <a
                className="form__button form__button--google"
                id="btn-google"
                href="http://localhost:8080/api/auth/unlink/google"
              >
                <span>Unlink G+</span>
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }
}

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
