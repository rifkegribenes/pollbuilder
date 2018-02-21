import React, { Component } from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";
// import { parse } from 'query-string';

import Header from "./containers/Header";
import Home from "./containers/Home";
import Login from "./containers/Login";
import Register from "./containers/Register";
import Profile from "./containers/Profile";
import Footer from "./containers/Footer";
import NotFound from "./containers/NotFound";
import Spinner from "./containers/Spinner";
import ModalSm from "./containers/ModalSm";

import * as apiActions from "./store/actions/apiActions";
import * as Actions from "./store/actions";

class App extends Component {
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
    } else {
      console.log("logged in:");
      console.log(this.props.appState.user.profile.email);
    }
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
  }

  render() {
    return (
      <div>
        <Spinner cssClass={this.props.appState.spinnerClass} />
        <ModalSm
          modalClass={this.props.appState.modal.class}
          modalText={this.props.appState.modal.text}
          modalType="modal__info"
          modalTitle={this.props.appState.modal.title}
          dismiss={() => {
            this.props.actions.dismissModal();
          }}
        />
        <div className="app" id="app">
          <Header history={this.props.history} />
          <main className="main" id="main">
            <Switch>
              <Route
                exact
                path="/"
                render={routeProps => <Home {...routeProps} />}
              />
              <Route
                path="/user/:id?/:token?"
                render={routeProps => <Profile {...routeProps} />}
              />
              <Route
                exact
                path="/login"
                render={routeProps => <Login {...routeProps} />}
              />
              <Route
                exact
                path="/register"
                render={routeProps => <Register {...routeProps} />}
              />
              <Route path="*" component={NotFound} />
            </Switch>
          </main>
          <Footer />
        </div>
      </div>
    );
  }
}

App.propTypes = {
  appState: PropTypes.shape({
    spinnerClass: PropTypes.string,
    modal: PropTypes.shape({
      class: PropTypes.string,
      text: PropTypes.string,
      title: PropTypes.string
    }),
    loggedIn: PropTypes.bool
  }).isRequired
};

const mapStateToProps = state => ({
  appState: state.appState
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch),
  api: bindActionCreators(apiActions, dispatch)
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
