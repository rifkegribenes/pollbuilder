import React from "react";
import PropTypes from "prop-types";

import ghIcon from "../img/github-white.svg";
import fbIcon from "../img/facebook-white.svg";
import ggIcon from "../img/google-white.svg";

const SocialAuth = props => (
  <div className="combo__social-wrap">
    <a
      className="form__button form__button--sm"
      href="http://localhost:8080/api/auth/github/"
      id="btn-github"
      onClick={() => {
        props.setSpinner("show");
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
    <a
      className="form__button form__button--sm"
      id="btn-facebook"
      href="http://localhost:8080/api/auth/facebook"
      onClick={() => {
        props.setSpinner("show");
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
      href="http://localhost:8080/api/auth/google"
      onClick={() => {
        props.setSpinner("show");
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
  </div>
);

SocialAuth.propTypes = {
  setSpinner: PropTypes.func,
  toggleLocalForm: PropTypes.func,
  buttonText: PropTypes.string
};

export default SocialAuth;
