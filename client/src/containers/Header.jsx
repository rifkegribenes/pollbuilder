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
        <p>Header</p>
        <Link className="nav__link" to="/login">
          Login
        </Link>
        <button
          onClick={() => {
            this.props.actions.logout();
            this.props.history.push("/");
          }}
        >
          Logout
        </button>
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
