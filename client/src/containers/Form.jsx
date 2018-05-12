import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";

import Spinner from "./Spinner";
import ModalSm from "./ModalSm";
import FormInput from "./FormInput";
import PollOptions from "./PollOptions";
import { fieldValidations, run, validateEmail } from "../utils/";
import * as Actions from "../store/actions";
import * as apiActions from "../store/actions/apiActions";

const initialState = {
  showLocalForm: false,
  submit: false
};

class Form extends React.Component {
  constructor(props) {
    super(props);

    this.state = { ...initialState };

    this.handleInput = this.handleInput.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.errorFor = this.errorFor.bind(this);
  }

  componentDidMount() {
    // clear previous errors
    this.props.actions.resetForm();
  }

  resetState() {
    this.setState({ ...initialState });
  }

  /*
  * Function: handleInput - On Change, send updated value to redux
  * @param {object} event - the change event triggered by the input.
  * All form inputs will use this handler; trigger the proper action
  * based on the input ID
  */
  handleInput(e, reducer) {
    this.props.actions.setFormField(e.target.id, e.target.value, reducer);
  }

  handleBlur(e, reducer) {
    const field = e.target.name;

    const runners = state => fieldValidations[state];

    // run fieldValidations on fields in form object and save to redux
    const vErrors = run(this.props[reducer].form, runners(this.props.form));

    let validationErrors;

    if (document.getElementById("email")) {
      validationErrors = validateEmail(vErrors);
    } else {
      validationErrors = vErrors;
    }

    const showFormError = !!Object.values(validationErrors).length;

    // set current field as 'touched' and display errors onBlur
    this.props.actions.setTouched(field);

    if (showFormError) {
      this.props.actions.setShowError(field, true);
      this.props.actions.setValidationErrors({ ...validationErrors });
    }
  }

  handleFocus(e, reducer) {
    const field = e.target.name;
    const runners = state => fieldValidations[state];

    // hide validation errors for focused field
    const vErrors = run(this.props[reducer].form, runners(this.props.form));
    delete vErrors[field];

    let validationErrors;

    if (document.getElementById("email")) {
      validationErrors = validateEmail(vErrors);
    } else {
      validationErrors = vErrors;
    }

    this.props.actions.setShowError(field, false);
    this.props.actions.setValidationErrors({ ...validationErrors });
    this.props.actions.showFormError(false);
  }

  errorFor(field, reducer) {
    // run validation check and return error(s) for this field
    if (Object.values(this.props[reducer].form.validationErrors).length) {
      if (
        this.props[reducer].form.validationErrors[field] &&
        (this.props[reducer].form.showFormError === true ||
          this.props[reducer].form.showFieldErrors[field] === true)
      ) {
        return this.props[reducer].form.validationErrors[field] || "";
      }
    }
    return null;
  }

  render() {
    const reducer = this.props.reducer;
    const fields = this.props.fields.map(field => {
      const { name, label, placeholder, autoComplete, type } = field;
      return (
        <div className="form__input-group" key={name}>
          <FormInput
            handleChange={e => this.handleInput(e, reducer)}
            handleBlur={e => this.handleBlur(e, reducer)}
            handleFocus={e => this.handleFocus(e, reducer)}
            label={label}
            placeholder={placeholder}
            autoComplete={autoComplete}
            showError={this.props[reducer].form.showFieldErrors[name]}
            value={this.props[reducer].form[name]}
            errorText={this.errorFor([name], [reducer])}
            touched={this.props[reducer].form.touched[name]}
            name={name}
            submit={this.state.submit}
            type={type || "text"}
          />
        </div>
      );
    });
    const buttonState = this.props[reducer].showFormError
      ? "form__button--disabled"
      : "";
    const errorClass =
      this.props[reducer].form.error ||
      (this.props[reducer].showFormError &&
        this.state.submit &&
        Object.values(this.props[reducer].form.validationErrors).length)
        ? "error"
        : "hidden";
    return (
      <div>
        <form className="form">
          <div className="form__body">
            {(this.props.form === "reset" ||
              this.props.form === "resetPwd") && (
              <div className="form__input-group center">
                {this.props.form === "resetPwd" ? (
                  <div className="form__text">
                    Enter a new password.<br />Make it a good one :)
                  </div>
                ) : (
                  <div className="form__text">
                    Please enter your email address.<br />We will send a link to
                    reset your password.
                  </div>
                )}
              </div>
            )}
            {fields}
            {this.props.form === "login" && (
              <div className="form__input-group center">
                <button
                  className="form__login-link"
                  type="button"
                  onClick={() => {
                    this.props.toggleForm("reset");
                  }}
                >
                  Forgot your password?
                </button>
              </div>
            )}
            {this.props.form === "create" && <PollOptions />}
            <div className="form__input-group">
              <div className={
                  this.props[reducer].form.error ||
                    (this.props[reducer].showFormError &&
                      this.state.submit &&
                      Object.values(this.props[reducer].form.validationErrors).length)
                  ? "error"
                  : "hidden"
                }>{this.props[reducer].errorMsg}</div>
            </div>
          </div>
          <div className="form__footer">
            <div className="form__input-group">
              <div className="form__button-wrap">
                <button
                  className={`form__button form__button--bottom ${buttonState}`}
                  id={`btn-${reducer}`}
                  type="button"
                  onClick={
                    () => this.props.formAction()
                  }
                >
                  <span>{this.props.buttonText}</span>
                </button>
              </div>
            </div>
          </div>
        </form>
        <Spinner cssClass={this.props[reducer].spinnerClass} />
        <ModalSm
          modalClass={this.props[reducer].modal.class}
          modalText={this.props[reducer].modal.text}
          modalTitle={this.props[reducer].modal.title}
          modalType={this.props[reducer].modal.type}
          buttonText={this.props[reducer].modal.buttonText || "Continue"}
          dismiss={() => {
            this.props.actions.dismissModal();
            this.props.actions.resetForm();
            if (
              this.props[reducer].modal.title === "Failure: Password not reset"
            ) {
              this.props.history.push("/reset");
              this.props.toggleForm("reset");
              return;
            }
            if (this.props[reducer].modal.title === "Check your Email" ||
                this.props[reducer].modal.buttonText === "Sign in") {
              this.props.history.push("/login");
              this.props.toggleForm("login");
              return;
            }
            if (this.props.toggleform) {
              this.props.toggleForm("login");
            }
          }}
          redirect={this.props[reducer].modal.redirect}
          history={this.props.history}
          location={this.props.location}
          resetForm={this.props.actions.resetForm}
          toggleForm={this.props.toggleForm || null}
          action={this.props[reducer].modal.action}
        />
      </div>
    );
  }
}

Form.propTypes = {
  actions: PropTypes.shape({
    dismissModal: PropTypes.func,
    setFormField: PropTypes.func,
    setFormError: PropTypes.func,
    clearFormError: PropTypes.func
  }).isRequired,
  api: PropTypes.shape({
    resetPassword: PropTypes.func
  }).isRequired,
  appState: PropTypes.shape({
    loggedIn: PropTypes.boolean
  }).isRequired,
  auth: PropTypes.shape({
    errorMsg: PropTypes.string,
    form: PropTypes.shape({
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      email: PropTypes.string,
      password: PropTypes.string,
      confirmPwd: PropTypes.string
    }).isRequired,
    modal: PropTypes.shape({
      class: PropTypes.string,
      text: PropTypes.string,
      title: PropTypes.string,
      type: PropTypes.string,
      buttonText: PropTypes.string,
      action: PropTypes.func,
      resetForm: PropTypes.func
    }).isRequired,
    spinnerClass: PropTypes.string
  }).isRequired,
  poll: PropTypes.shape({
    errorMsg: PropTypes.string,
    form: PropTypes.shape({
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      email: PropTypes.string,
      password: PropTypes.string,
      confirmPwd: PropTypes.string
    }).isRequired,
    modal: PropTypes.shape({
      class: PropTypes.string,
      text: PropTypes.string,
      title: PropTypes.string,
      type: PropTypes.string,
      buttonText: PropTypes.string,
      action: PropTypes.func,
      resetForm: PropTypes.func
    }).isRequired,
    spinnerClass: PropTypes.string
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      key: PropTypes.string
    })
  }).isRequired,
  toggleForm: PropTypes.func,
  form: PropTypes.string.isRequired,
  reducer: PropTypes.string.isRequired,
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      placeholder: PropTypes.string,
      label: PropTypes.string,
      type: PropTypes.string,
      autoComplete: PropTypes.string
    })
  ).isRequired,
  buttonText: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  poll: state.poll,
  appState: state.appState
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch),
  api: bindActionCreators(apiActions, dispatch)
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Form));
