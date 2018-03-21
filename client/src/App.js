import React, { Component } from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";
import { debounce } from "lodash";

import Header from "./containers/Header";
import Home from "./containers/Home";
import ComboBox from "./containers/ComboBox";
import Profile from "./containers/Profile";
import Footer from "./containers/Footer";
import NotFound from "./containers/NotFound";
import Spinner from "./containers/Spinner";
import ModalSm from "./containers/ModalSm";
import VerifyEmail from "./containers/VerifyEmail";
import CreatePoll from "./containers/CreatePoll";
import Logout from "./containers/Logout";
import Polls from "./containers/Polls";

import * as apiActions from "./store/actions/apiActions";
import * as Actions from "./store/actions";

class App extends Component {
  componentWillMount() {
    this.updateDimensions();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  // Set window dimensions in Redux
  updateDimensions = () => {
    const size = {
      width: window.innerWidth,
      height: window.innerHeight
    };
    this.props.actions.setWindowSize(size);
    if (
      this.props.appState.windowSize.width > 650 &&
      this.props.appState.menuState === "open"
    ) {
      this.props.actions.setMenuState("closed");
    }
  };

  componentDidMount() {
    window.addEventListener("resize", debounce(this.updateDimensions, 100));

    // check whether user is tabbing or using mouse,
    // set focus classes conditionally
    const handleFirstTab = e => {
      if (e.keyCode === 9) {
        document.body.classList.add("user-is-tabbing");
        window.removeEventListener("keydown", handleFirstTab);
        window.addEventListener("mousedown", handleMouseDownOnce);
      }
    };

    const handleMouseDownOnce = () => {
      document.body.classList.remove("user-is-tabbing");
      window.removeEventListener("mousedown", handleMouseDownOnce);
      window.addEventListener("keydown", handleFirstTab);
    };

    window.addEventListener("keydown", handleFirstTab);
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
          <Route render={routeProps => <Header {...routeProps} />} />
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
                render={routeProps => (
                  <ComboBox
                    initialForm="login"
                    location={routeProps.location}
                    history={routeProps.history}
                    match={routeProps.match}
                  />
                )}
              />
              <Route
                exact
                path="/register"
                render={routeProps => (
                  <ComboBox
                    initialForm="signup"
                    location={routeProps.location}
                    history={routeProps.history}
                    match={routeProps.match}
                  />
                )}
              />
              <Route
                path="/verify/:key?"
                render={routeProps => <VerifyEmail {...routeProps} />}
              />
              <Route
                exact
                path="/reset"
                render={routeProps => (
                  <ComboBox
                    initialForm="reset"
                    location={routeProps.location}
                    history={routeProps.history}
                    match={routeProps.match}
                  />
                )}
              />
              <Route
                path="/resetpassword/:key"
                render={routeProps => (
                  <ComboBox
                    initialForm="resetPwd"
                    location={routeProps.location}
                    history={routeProps.history}
                    match={routeProps.match}
                  />
                )}
              />
              <Route
                exact
                path="/createpoll"
                render={routeProps => <CreatePoll {...routeProps} />}
              />
              <Route
                exact
                path="/polls"
                render={routeProps => <Polls {...routeProps} />}
              />
              <Route
                exact
                path="/logout"
                render={routeProps => <Logout {...routeProps} />}
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
  }).isRequired,
  profile: PropTypes.shape({
    user: PropTypes.shape({
      profile: PropTypes.shape({
        email: PropTypes.string
      })
    })
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
