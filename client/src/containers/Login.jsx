import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import update from "immutability-helper";

import * as Actions from "../store/actions";
import * as apiActions from "../store/actions/apiActions";

import Spinner from "./Spinner";
import ModalSm from "./ModalSm";
import FormInput from "./FormInput";
import { fieldValidationsLogin, run } from "../utils/";

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showFormErrors: false,
      showFieldErrors: {
        email: false,
        password: false
      },
      validationErrors: {},
      touched: {
        email: false,
        password: false
      },
      submit: false
    };

    this.handleInput = this.handleInput.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.errorFor = this.errorFor.bind(this);
  }
  componentDidMount() {
    // clear previous errors
    this.props.actions.clearFormError();
  }

  /* Function login - Perform basic validation:
  * - username is at least 1 char
  * - password is at least 1 char
  * If valid, call the login route; store token in redux, clear password from state
  * , return to Home
  */
  login() {
    const { email, password } = this.props.login.form;

    // show validation errors
    const newState = { ...this.state };
    newState.submit = true;
    newState.showFormErrors = true;

    const validationErrors = run(this.props.login.form, fieldValidationsLogin);

    newState.validationErrors = { ...validationErrors };
    this.setState({ ...newState });

    if (email && password) {
      const body = { email, password };
      this.props.api.login(body).then(result => {
        if (result.type === "LOGIN_SUCCESS") {
          this.props.history.push("/");
        }
      });
    } else if (!email) {
      this.props.actions.setFormError("Email cannot be blank");
    } else if (!password) {
      this.props.actions.setFormError("Password cannot be blank");
    }
  }

  resetPassword() {
    const email = this.props.login.form.email;
    if (!email) {
      this.props.actions.setFormError("Email required to reset password");
    } else {
      this.props.api.sendResetEmail({ email });
    }
  }

  /*
  * Function: handleInput - On Change, send updated value to redux
  * @param {object} event - the change event triggered by the input.
  * All form inputs will use this handler; trigger the proper action
  * based on the input ID
  */
  handleInput(e) {
    this.props.actions.setFormField(e.target.id, e.target.value);
    if (e.which === 13) {
      this.login();
    }
  }

  handleBlur(e) {
    const field = e.target.name;

    // run fieldValidations on fields in form object and save to state
    const validationErrors = run(this.props.login.form, fieldValidationsLogin);

    const showFormErrors = !!Object.values(validationErrors).length;

    // set current field as 'touched' and display errors onBlur
    const newState = update(this.state, {
      touched: {
        [field]: { $set: true }
      },
      showFieldErrors: {
        [field]: { $set: true }
      },
      validationErrors: { $set: { ...validationErrors } },
      showFormErrors: { $set: showFormErrors }
    });

    this.setState({ ...newState });
  }

  handleFocus(e) {
    const field = e.target.name;

    // hide validation errors for focused field
    const validationErrors = run(this.props.login.form, fieldValidationsLogin);
    validationErrors[field] = false;

    const newState = update(this.state, {
      showFieldErrors: {
        [field]: { $set: false }
      },
      validationErrors: { $set: { ...validationErrors } },
      showFormErrors: { $set: false }
    });

    this.setState({ ...newState });
  }

  errorFor(field) {
    // run validation check and return error(s) for this field
    if (Object.values(this.state.validationErrors).length) {
      if (
        this.state.validationErrors[field] &&
        (this.state.showFormErrors === true ||
          this.state.showFieldErrors[field] === true)
      ) {
        return this.state.validationErrors[field] || "";
      }
    }
    return null;
  }

  render() {
    const errorClass = this.props.login.errorMsg ? "error" : "hidden";
    return (
      <div>
        <Spinner cssClass={this.props.login.spinnerClass} />
        <ModalSm
          modalClass={this.props.login.modal.class}
          modalText={this.props.login.modal.text}
          modalType="modal__info"
          modalTitle={this.props.login.modal.title}
          dismiss={() => {
            this.props.actions.dismissModal();
          }}
          action={() => {
            this.props.actions.dismissModal();
            this.props.history.push("/");
          }}
        />
        <form className="container form">
          <div className="form__body">
            <div className="form__header">Sign In</div>
            <div className="form__input-group">
              <FormInput
                handleChange={this.handleInput}
                handleBlur={this.handleBlur}
                handleFocus={this.handleFocus}
                placeholder="Email"
                autoComplete="email"
                type="email"
                showError={this.state.showFieldErrors.email}
                value={this.props.login.form.email}
                errorText={this.errorFor("email")}
                touched={this.state.touched.email}
                name="email"
                inputRef={el => (this.emailInput = el)}
                submit={this.state.submit}
              />
            </div>
            <div className="form__input-group">
              <FormInput
                handleChange={this.handleInput}
                handleBlur={this.handleBlur}
                handleFocus={this.handleFocus}
                placeholder="Password"
                autoComplete="new-password"
                type="password"
                showError={this.state.showFieldErrors.password}
                value={this.props.login.form.password}
                errorText={this.errorFor("password")}
                touched={this.state.touched.password}
                name="password"
                submit={this.state.submit}
              />
            </div>
            <div className="form__input-group">
              <div className="form__button-wrap">
                <button
                  className="form__button pointer"
                  id="btn-login"
                  onClick={() => this.login()}
                  type="button"
                >
                  Sign In
                </button>
              </div>
            </div>
            <div className="form__input-group">
              <div className={errorClass}>{this.props.login.errorMsg}</div>
            </div>
            <div className="form__input-group  form__link-group">
              <button
                className="form__login-link"
                type="button"
                onClick={() => this.resetPassword()}
              >
                Reset Password
              </button>
              <Link className="form__login-link" to="/register">
                Create new account
              </Link>
            </div>
            <div className="form__input-group">
              <hr className="form__hr" />
              <div className="form__text">Or log in with&hellip;</div>
              <div className="form__button-wrap">
                <a
                  className="form__button form__button--github"
                  href="http://localhost:8080/api/auth/github/"
                  id="btn-github"
                >
                  <span>GH</span>
                </a>
                <a
                  className="form__button form__button--facebook"
                  id="btn-facebook"
                  href="http://localhost:8080/api/auth/facebook"
                >
                  <span>FB</span>
                </a>
                <a
                  className="form__button form__button--google"
                  id="btn-google"
                  href="http://localhost:8080/api/auth/google"
                >
                  <span>G+</span>
                </a>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

Login.propTypes = {
  actions: PropTypes.shape({
    setFormField: PropTypes.func,
    setFormError: PropTypes.func,
    clearFormError: PropTypes.func,
    dismissModal: PropTypes.func
  }).isRequired,
  api: PropTypes.shape({
    login: PropTypes.func
  }).isRequired,
  login: PropTypes.shape({
    form: PropTypes.shape({
      email: PropTypes.string,
      password: PropTypes.string,
      confirmPwd: PropTypes.string
    }).isRequired,
    errorMsg: PropTypes.string,
    spinnerClass: PropTypes.string,
    modal: PropTypes.shape({
      class: PropTypes.string,
      text: PropTypes.string,
      title: PropTypes.string
    })
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func
  }).isRequired
};

const mapStateToProps = state => ({
  login: state.login
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch),
  api: bindActionCreators(apiActions, dispatch)
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));
