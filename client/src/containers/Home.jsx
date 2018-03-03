import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as Actions from "../store/actions";
import * as apiActions from "../store/actions/apiActions";

class Home extends React.Component {
  componentDidMount() {
    // Check for hash-fragment and stash it in redux
    // if the redirect is "/resetpassword" or "/validate" then go immediately
    if (this.props.location.hash) {
      const hash = this.props.location.hash.slice(2);
      const url = `/${hash.split("=")[1]}`;
      if (url.startsWith("/resetpassword")) {
        this.props.history.push(url);
        return;
      } else if (url.startsWith("/validate")) {
        // do this in case validate forces login
        this.props.actions.setRedirectUrl(url);
        this.props.history.push(url);
      } else {
        this.props.actions.setRedirectUrl(url);
      }
    }
    // If not logged in, check local storage for authToken
    // if it doesn't exist, it returns the string "undefined"
    if (!this.props.appState.loggedIn) {
      let token = window.localStorage.getItem("authToken");
      if (token && token !== "undefined") {
        token = JSON.parse(token);
        const user = JSON.parse(window.localStorage.getItem("userId"));
        // If we validate successfully, look for redirect_url and follow it
        this.props.api.validateToken(token, user).then(result => {
          if (result.type === "VALIDATE_TOKEN_SUCCESS") {
            if (this.props.appState.redirectUrl) {
              // this.props.history.push(this.props.appState.redirectUrl);
              // this.props.actions.setRedirectUrl('');
            }
          }
        });
      } else if (this.props.location.hash) {
        this.props.history.push("/login");
      }
    } else {
      console.log("logged in:");
      console.log(this.props.profile.user.profile.email);
    }
  }

  render() {
    return <div className="container">Home</div>;
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Home));
