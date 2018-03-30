import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";
import update from "immutability-helper";

import Spinner from "./Spinner";
import ModalSm from "./ModalSm";
import FormInput from "./FormInput";
import { fieldValidations, run, validateEmail } from "../utils/";
import * as Actions from "../store/actions";
import * as apiActions from "../store/actions/apiActions";

const initialState = {
  showFormErrors: false,
  showLocalForm: false,
  showFieldErrors: {},
  validationErrors: {},
  touched: {},
  submit: false,
  success: null
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

  handleFocus(e, reducer) {
    const field = e.target.name;
    const runners = state => fieldValidations[state];

    // hide validation errors for focused field
    const vErrors = run(this.props[reducer].form, runners(this.props.form));
    vErrors[field] = false;

    let validationErrors;

    if (document.getElementById("email")) {
      validationErrors = validateEmail(vErrors);
    } else {
      validationErrors = vErrors;
    }

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
    const reducer = this.props.reducer;
    const fields = this.props.fields.map(field => {
      const { name, label, placeholder, autoComplete, type } = field;
      return (
        <div className="form__input-group" key={name}>
          <FormInput
            handleChange={this.handleInput}
            handleBlur={this.handleBlur}
            handleFocus={this.handleFocus}
            label={label}
            placeholder={placeholder}
            autoComplete={autoComplete}
            showError={this.state.showFieldErrors[name]}
            value={this.props[reducer].form[name]}
            errorText={this.errorFor([name])}
            touched={this.state.touched[name]}
            name={name}
            submit={this.state.submit}
            type={type || "text"}
          />
        </div>
      );
    });
    const buttonState = this.state.showFormErrors
      ? "form__button--disabled"
      : "";
    const errorClass =
      this.props[reducer].form.error ||
      (this.state.showFormErrors &&
        this.state.submit &&
        Object.values(this.state.validationErrors).length)
        ? "error"
        : "hidden";
    return (
      <div>
        <form className="form">
          <div className="form__body">
            {fields}
            <div className="form__input-group">
              <div className={errorClass}>{this.props[reducer].errorMsg}</div>
            </div>
          </div>
          <div className="form__footer">
            <div className="form__input-group">
              <div className="form__button-wrap">
                <button
                  className={`form__button form__button--bottom ${buttonState}`}
                  id={`btn-${reducer}`}
                  type="button"
                  onClick={() => this.props[reducer].formAction()}
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
          }}
          redirect={this.props[reducer].modal.redirect}
          history={this.props.history}
          location={this.props.location}
          resetForm={this.props.actions.resetForm}
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
