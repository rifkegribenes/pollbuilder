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
      if (result === "GET_PROFILE_SUCCESS") {
        console.log(this.props.appState.user);
      }
    });
  }

  render() {
    return (
      <div className="profile">
        <div className="profile__header">Profile</div>
        <div className="profile__name">
          {this.props.appState.user.profile.firstName}{" "}
          {this.props.appState.user.profile.lastName}
        </div>
        <div className="profile__email">
          {this.props.appState.user.profile.email}
        </div>
        <div className="profile__pic">
          <img
            src={this.props.appState.user.profile.avatarUrl}
            alt={`${this.props.appState.user.profile.firstName} ${
              this.props.appState.user.profile.lastName
            }`}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  appState: state.appState
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch),
  api: bindActionCreators(apiActions, dispatch)
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Profile)
);
