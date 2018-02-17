import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as Actions from "../store/actions";
import * as apiActions from "../store/actions/apiActions";

class Profile extends React.Component {
  componentDidMount() {
    // copy requested profile data into currentProfile
    let userId;
    let token;
    if (this.props.match && this.props.match.params.id) {
      userId = this.props.match.params.id;
      token = this.props.match.params.token;
    } else {
      userId = this.props.appState.user._id;
      token = this.props.appState.authToken;
    }

    // if logged in through social auth, need to set authToken & userId
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
