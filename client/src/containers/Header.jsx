import React from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as Actions from "../store/actions";

import vaIcon from "../img/rainbow_icon_120.png";

class Header extends React.Component {
  render() {
    return (
      <header className="header">
        <Link className="h-nav__link h-nav__link--home" to="/">
          <img src={vaIcon} className="h-nav__logo" alt="logo" />
          <span className="h-nav__logo--text">Voting App</span>
        </Link>
        {this.props.appState.loggedIn && (
          <Link className="h-nav__link" to="/user">
            Profile
          </Link>
        )}
        {this.props.appState.loggedIn && (
          <Link className="h-nav__link" to="/createpoll">
            Create Poll
          </Link>
        )}
        {this.props.appState.loggedIn ? (
          <button
            className="h-nav__link"
            onClick={() => {
              this.props.actions.logout();
              this.props.history.push("/");
            }}
          >
            Logout
          </button>
        ) : (
          <Link className="form__button form__button--big" to="/login">
            Login
          </Link>
        )}
        {this.props.appState.loggedIn && (
          <div className="header__email">
            {this.props.profile.user.profile.email}
          </div>
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
  appState: state.appState,
  profile: state.profile
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch)
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
