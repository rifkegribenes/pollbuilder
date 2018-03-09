import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";
import update from "immutability-helper";

import Spinner from "./Spinner";
import ModalSm from "./ModalSm";
import FormInput from "./FormInput";
import { fieldValidations, run } from "../utils/";
import * as Actions from "../store/actions";
import * as apiActions from "../store/actions/apiActions";

class ResetPassword extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showFormErrors: false,
      showFieldErrors: {
        password: false,
        confirmPwd: false
      },
      validationErrors: {},
      touched: {
        password: false,
        confirmPwd: false
      },
      submit: false
    };

    this.handleInput = this.handleInput.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.errorFor = this.errorFor.bind(this);
  }
  ComponentDidMount() {
    this.props.actions.clearFormError();
  }

  reset = () => {
    const key = this.props.match.params.key;
    const { password, confirmPwd } = this.props.login.form;

    // show validation errors
    const newState = { ...this.state };
    newState.submit = true;
    newState.showFormErrors = true;

    const validationErrors = run(this.props.login.form, fieldValidations.reset);

    newState.validationErrors = { ...validationErrors };
    this.setState({ ...newState });

    // validate form data
    if (password && password === confirmPwd) {
      const body = {
        password,
        key
      };
      this.props.api.resetPassword(body);
    } else {
      if (!password) {
        this.props.actions.setFormError({
          message: "Password is required"
        });
      }
      if (password !== confirmPwd) {
        this.props.actions.setFormError({
          message: "Passwords do not match"
        });
      }
    }
  };

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
    // console.log(`blur: ${field}`);
    // run fieldValidations on fields in form object and save to state
    const validationErrors = run(this.props.login.form, fieldValidations.reset);

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
    // console.log(`focus: ${field}`);
    // hide validation errors for focused field
    const validationErrors = run(this.props.login.form, fieldValidations.reset);
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
    const showError = this.props.login.errorMsg ? "" : "form__hidden";
    const buttonState = this.state.showFormErrors
      ? "form__button--disabled"
      : "";
    return (
      <div className="container form">
        <div className="form__body">
          <div className="form__header">Reset Password</div>
          <div className="form__input-group">
            <FormInput
              handleChange={this.handleInput}
              handleBlur={this.handleBlur}
              handleFocus={this.handleFocus}
              placeholder="New Password"
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
            <FormInput
              handleChange={this.handleInput}
              handleBlur={this.handleBlur}
              handleFocus={this.handleFocus}
              placeholder="Confirm Password"
              autoComplete="new-password"
              type="password"
              showError={this.state.showFieldErrors.confirmPwd}
              value={this.props.login.form.confirmPwd}
              errorText={this.errorFor("confirmPwd")}
              touched={this.state.touched.confirmPwd}
              name="confirmPwd"
              submit={this.state.submit}
            />
          </div>
          <div className="form__input-group">
            <div className={`form__error ${showError}`}>
              {this.props.login.errorMsg}
            </div>
          </div>
          <div className="form__input-group">
            <div className="form__button-wrap">
              <button
                className={`form__button ${buttonState}`}
                id="btn-reset"
                onClick={() => this.reset()}
                disabled={this.state.showFormErrors}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
        <Spinner cssClass={this.props.login.spinnerClass} />
        <ModalSm
          modalClass={this.props.login.modal.class}
          modalText={this.props.login.modal.text}
          modalTitle={
            this.props.login.modal.type === "modal__success"
              ? "RESET PASSWORD SUCCESS"
              : "RESET PASSWORD FAILURE"
          }
          modalType={this.props.login.modal.type}
          buttonText={
            this.props.login.modal.type === "modal__success"
              ? "Sign In"
              : "Continue"
          }
          dismiss={() => {
            this.props.actions.dismissModal();
            this.props.history.push("/login");
          }}
        />
      </div>
    );
  }
}

ResetPassword.propTypes = {
  actions: PropTypes.shape({
    dismissModal: PropTypes.func,
    setFormField: PropTypes.func,
    setFormError: PropTypes.func,
    clearFormError: PropTypes.func
  }).isRequired,
  api: PropTypes.shape({
    resetPassword: PropTypes.func
  }).isRequired,
  login: PropTypes.shape({
    form: PropTypes.shape({
      email: PropTypes.string,
      password: PropTypes.string,
      confirmPwd: PropTypes.string
    }).isRequired,
    modal: PropTypes.shape({
      class: PropTypes.string,
      text: PropTypes.string,
      title: PropTypes.string
    }).isRequired,
    spinnerClass: PropTypes.string
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      key: PropTypes.string
    })
  }).isRequired
};

const mapStateToProps = state => ({
  login: state.login
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch),
  api: bindActionCreators(apiActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);
