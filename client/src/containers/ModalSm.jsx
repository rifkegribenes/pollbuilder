import React from "react";
import { connect } from "react-redux";
import { withRouter, Route } from "react-router-dom";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";
import * as Actions from "../store/actions";
import Modal from "react-modal";
import update from "immutability-helper";

import FormInput from "./FormInput";
import { fieldValidations, run } from "../utils/";

const app = document.getElementById("app");

class ModalSm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showFormErrors: false,
      showFieldErrors: {
        firstName: false,
        lastName: false,
        email: false,
        avatarUrl: false
      },
      validationErrors: {},
      touched: {
        firstName: false,
        lastName: false,
        email: false,
        avatarUrl: false
      },
      submit: false
    };

    this.handleInput = this.handleInput.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.errorFor = this.errorFor.bind(this);
  }

  /*
  * Function: handleInput - On Change, send updated value to redux
  * @param {object} event - the change event triggered by the input.
  * All form inputs will use this handler; trigger the proper action
  * based on the input ID
  */
  handleInput(e) {
    this.props.actions.setFormField(e.target.id, e.target.value);
  }

  handleBlur(e) {
    console.log("handleBlur");
    const field = e.target.name;

    const runners = state => fieldValidations[state];

    // run fieldValidations on fields in form object and save to state
    const validationErrors = run(
      this.props.auth.form,
      runners(this.props.inputName[0])
    );

    if (document.getElementById("email")) {
      if (!document.getElementById("email").validity.valid) {
        validationErrors.email = "Please enter a valid email address";
      }
    }

    if (document.getElementById("avatarUrl")) {
      if (!document.getElementById("avatarUrl").validity.valid) {
        validationErrors.avatarUrl = "Please enter a valid URL";
      }
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

  handleFocus(e) {
    const field = e.target.name;
    const runners = state => fieldValidations[state];

    // hide validation errors for focused field
    const validationErrors = run(
      this.props.auth.form,
      runners(this.props.inputName[0])
    );
    validationErrors[field] = false;

    if (document.getElementById("email")) {
      if (!document.getElementById("email").validity.valid) {
        validationErrors.email = "Please enter a valid email address";
      }
    }

    if (document.getElementById("avatarUrl")) {
      if (!document.getElementById("avatarUrl").validity.valid) {
        validationErrors.avatarUrl = "Please enter a valid URL";
      }
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
    const inputType = this.props.inputType ? this.props.inputType[0] : "text";
    return (
      <Route
        render={routeProps => (
          <Modal
            overlayClassName="overlay"
            className="react-modal"
            isOpen={
              this.props.modalClass === "modal modal__show" ||
              this.props.modalClass === "modal__show"
            }
            onRequestClose={this.props.dismiss}
            contentLabel={this.props.modalTitle}
            appElement={app}
            history={routeProps.history}
            location={routeProps.location}
            match={routeProps.match}
          >
            <div className={`modal ${this.props.modalClass}`}>
              <div className={`modal__header ${this.props.modalType}`}>
                {this.props.modalTitle}
                <button
                  className="dismiss aria-button modal-close modal-close-sm"
                  onClick={this.props.dismiss}
                  tabIndex="0"
                >
                  &times;
                </button>
                {this.props.modalType === "modal__success" && (
                  <svg className="modal__checkbox" viewBox="0 0 130.2 130.2">
                    <circle
                      className="path circle"
                      fill="none"
                      stroke="#73AF55"
                      strokeWidth="6"
                      strokeMiterlimit="10"
                      cx="65.1"
                      cy="65.1"
                      r="62.1"
                    />
                    <polyline
                      className="path check"
                      fill="none"
                      stroke="#73AF55"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeMiterlimit="10"
                      points="100.2,40.2 51.5,88.8 29.8,67.5 "
                    />
                  </svg>
                )}
              </div>
              <div className="modal__body">{this.props.modalText}</div>
              {this.props.inputName && (
                <div>
                  <div className="form__input-group">
                    <FormInput
                      handleChange={this.handleInput}
                      handleBlur={this.handleBlur}
                      handleFocus={this.handleFocus}
                      label={this.props.inputLabel[0]}
                      placeholder={this.props.inputPlaceholder[0]}
                      showError={
                        this.state.showFieldErrors[this.props.inputName[0]]
                      }
                      value={this.props.auth.form[this.props.inputName[0]]}
                      errorText={this.errorFor([this.props.inputName[0]])}
                      touched={this.state.touched[this.props.inputName[0]]}
                      name={this.props.inputName[0]}
                      type={inputType}
                      submit={this.state.submit}
                    />
                  </div>
                  {this.props.inputName.length > 1 && (
                    <div className="form__input-group">
                      <FormInput
                        handleChange={this.handleInput}
                        handleBlur={this.handleBlur}
                        handleFocus={this.handleFocus}
                        label={this.props.inputLabel[1]}
                        placeholder={this.props.inputPlaceholder[1]}
                        showError={
                          this.state.showFieldErrors[this.props.inputName[1]]
                        }
                        value={this.props.auth.form[this.props.inputName[1]]}
                        errorText={this.errorFor([this.props.inputName[1]])}
                        touched={this.state.touched[this.props.inputName[1]]}
                        name={this.props.inputName[1]}
                        submit={this.state.submit}
                      />
                    </div>
                  )}
                </div>
              )}
              {this.props.modalDanger ? (
                <div className="modal__action">
                  <button
                    className="modal__button"
                    onClick={this.props.dismiss}
                  >
                    Cancel
                  </button>
                  <button
                    className="modal__button modal__danger"
                    onClick={this.props.action}
                  >
                    Delete
                  </button>
                </div>
              ) : (
                <div className="modal__action">
                  <button
                    className="modal__button"
                    onClick={() => {
                      if (this.props.redirect) {
                        this.props.history.push(`${this.props.redirect}`);
                      }
                      if (this.props.action) {
                        this.props.action();
                      }
                      if (this.props.resetForm) {
                        this.props.resetForm();
                      }
                      this.props.dismiss();
                    }}
                  >
                    {this.props.buttonText || "Continue"}
                  </button>
                </div>
              )}
            </div>
          </Modal>
        )}
      />
    );
  }
}

Modal.setAppElement("body");

ModalSm.propTypes = {
  modalClass: PropTypes.string.isRequired,
  modalText: PropTypes.string.isRequired,
  modalType: PropTypes.string,
  modalTitle: PropTypes.string,
  action: PropTypes.func,
  buttonText: PropTypes.string,
  dismiss: PropTypes.func.isRequired,
  modalDanger: PropTypes.bool
};
ModalSm.defaultProps = {
  modalType: "modal__info",
  modalTitle: "",
  modalText: "",
  action: null,
  modalDanger: false
};

const mapStateToProps = state => ({
  appState: state.appState,
  profile: state.profile,
  auth: state.auth
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch)
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ModalSm)
);
