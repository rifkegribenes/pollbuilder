import React from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as Actions from "../store/actions";

class Header extends React.Component {
  render() {
    return (
      <header className="header">
        <Link className="nav__link" to="/">
          Home
        </Link>
        {!this.props.appState.loggedIn && (
          <Link className="nav__link" to="/login">
            Login
          </Link>
        )}
        {this.props.appState.loggedIn && (
          <button
            className="nav__link"
            onClick={() => {
              this.props.actions.logout();
              this.props.history.push("/");
              console.log(`loggedIn: ${this.props.appState.loggedIn}`);
            }}
          >
            Logout
          </button>
        )}
        {this.props.appState.loggedIn && (
          <div className="header__email">{this.props.appState.user.email}</div>
        )}
      </header>
    );
  }
}

Header.propTypes = {
  actions: PropTypes.shape({
    logout: PropTypes.func
  }),
  history: PropTypes.shape({
    push: PropTypes.func
  }),
  appState: PropTypes.shape({
    loggedIn: PropTypes.bool,
    authToken: PropTypes.string,
    user: PropTypes.shape({
      _id: "",
      avatarUrl: "",
      displayName: "",
      email: ""
    })
  }).isRequired
};

const mapStateToProps = state => ({
  appState: state.appState
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch)
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
