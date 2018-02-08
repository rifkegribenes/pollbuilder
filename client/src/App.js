import React, { Component } from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";

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

class App extends Component {
  componentDidMount() {
    console.log(`loggedIn: ${this.props.appState.loggedIn}`);
    let token = window.localStorage.getItem("authToken");
    let userId = window.localStorage.getItem("userId");
    if (token && token !== "undefined") {
      token = JSON.parse(token);
      userId = JSON.parse(userId);
      // Update application state
      this.props.api.validateToken(token, userId);
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
                exact
                path="/profile"
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
  api: bindActionCreators(apiActions, dispatch)
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
