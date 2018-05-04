import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as Actions from "../store/actions";

import ghIcon from "../img/github-white.svg";
import fbIcon from "../img/facebook-white.svg";
import ggIcon from "../img/google-white.svg";

const SocialAuth = props => (
  <div className="combo__social-wrap">
    <a
      className="form__button form__button--sm"
      id="btn-facebook"
      href="/api/auth/facebook"
      target="_self"
      onClick={() => {
        props.actions.setSpinner("show");
        props.toggleLocalForm(false);
      }}
    >
      <div className="form__button--facebook">
        <img
          className="form__icon form__icon--facebook"
          alt="facebook"
          src={fbIcon}
        />
      </div>
      <span className="form__sm-button-text">{`${
        props.buttonText
      } with Facebook`}</span>
    </a>
    <a
      className="form__button form__button--sm"
      id="btn-google"
      href="/api/auth/google"
      target="_self"
      onClick={() => {
        props.actions.setSpinner("show");
        props.toggleLocalForm(false);
      }}
    >
      <div className="form__button--google">
        <img
          className="form__icon form__icon--google"
          alt="google"
          src={ggIcon}
        />
      </div>
      <span className="form__sm-button-text">{`${
        props.buttonText
      } with Google`}</span>
    </a>
    <a
      className="form__button form__button--sm"
      href="/api/auth/github/"
      target="_self"
      id="btn-github"
      onClick={() => {
        props.actions.setSpinner("show");
        props.toggleLocalForm(false);
      }}
    >
      <div className="form__button--github">
        <img
          className="form__icon form__icon--github"
          alt="github"
          src={ghIcon}
        />
      </div>
      <span className="form__sm-button-text">{`${
        props.buttonText
      } with Github`}</span>
    </a>
  </div>
);

SocialAuth.propTypes = {
  setSpinner: PropTypes.func,
  toggleLocalForm: PropTypes.func,
  buttonText: PropTypes.string
};

const mapStateToProps = state => ({
  appState: state.appState,
  profile: state.profile,
  poll: state.poll
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(SocialAuth);
