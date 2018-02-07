import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as Actions from "../store/actions";
import * as apiActions from "../store/actions/apiActions";

class Home extends React.Component {
  componentDidMount() {
    // If not logged in, check local storage for authToken
    // if it doesn't exist, it returns the string "undefined"
    if (!this.props.appState.loggedIn) {
      let token = window.localStorage.getItem("authToken");
      if (token && token !== "undefined") {
        console.log("found token");
        token = JSON.parse(token);
        const user = JSON.parse(window.localStorage.getItem("userId"));
        console.log(`user: ${user}`);
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
    }
  }

  render() {
    return <div className="container">Home</div>;
  }
}

const mapStateToProps = state => ({
  appState: state.appState
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch),
  api: bindActionCreators(apiActions, dispatch)
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Home));
