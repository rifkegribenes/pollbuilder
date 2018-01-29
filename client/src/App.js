import React, { Component } from "react";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import { connect } from "react-redux";
// import { bindActionCreators } from 'redux';
import PropTypes from "prop-types";

import Header from "./containers/Header";
import Home from "./containers/Home";
import Login from "./containers/Login";
import Profile from "./containers/Profile";
import Footer from "./containers/Footer";
import NotFound from "./containers/NotFound";
import Spinner from "./containers/Spinner";
import ModalSm from "./containers/ModalSm";

class App extends Component {
  state = {
    response: ""
  };

  componentDidMount() {
    this.callApi()
      .then(res => this.setState({ response: res.express }))
      .catch(err => console.log(err));
  }

  callApi = async () => {
    const response = await fetch("/api/hello");
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  render() {
    return (
      <BrowserRouter>
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
          <div className="app">
            <Header />
            <main className="main" id="main">
              <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/profile" component={Profile} />
                <Route exact path="/login" component={Login} />
                <Route path="*" component={NotFound} />
              </Switch>
            </main>
            <Footer />
          </div>
        </div>
      </BrowserRouter>
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
    })
  }).isRequired
};

const mapStateToProps = state => ({
  appState: state.appState
});

export default connect(mapStateToProps)(App);
