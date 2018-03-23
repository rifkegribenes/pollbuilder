import React from "react";
import { connect } from "react-redux";
import { withRouter, Route } from "react-router-dom";
import PropTypes from "prop-types";
import Modal from "react-modal";

import FormInput from "./FormInput";

const app = document.getElementById("app");

const ModalSm = props => (
  <Route
    render={routeProps => (
      <Modal
        overlayClassName="overlay"
        className="react-modal"
        isOpen={
          props.modalClass === "modal modal__show" ||
          props.modalClass === "modal__show"
        }
        onRequestClose={props.dismiss}
        contentLabel={props.modalTitle}
        appElement={app}
        history={routeProps.history}
        location={routeProps.location}
        match={routeProps.match}
      >
        <div className={`modal ${props.modalClass}`}>
          <div className={`modal__header ${props.modalType}`}>
            {props.modalTitle}
            <button
              className="dismiss aria-button modal-close modal-close-sm"
              onClick={props.dismiss}
              tabIndex="0"
            >
              &times;
            </button>
            {props.modalType === "modal__success" && (
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
          {props.inputName && (
            <div className="form__input-group">
              <FormInput
                handleChange={props.handleInput}
                handleBlur={props.handleBlur}
                handleFocus={props.handleFocus}
                label={props.inputLabel}
                placeholder={props.inputPlaceholder}
                showError={props.showFieldErrors[props.inputName]}
                value={props.login.form[props.inputName]}
                errorText={props.errorFor([props.inputName])}
                touched={props.touched[props.inputName]}
                name={props.inputName}
                submit={props.submit}
              />
            </div>
          )}
          <div className="modal__body">{props.modalText}</div>
          {props.modalDanger ? (
            <div className="modal__action">
              <button className="modal__button" onClick={props.dismiss}>
                Cancel
              </button>
              <button
                className="modal__button modal__danger"
                onClick={props.action}
              >
                Delete
              </button>
            </div>
          ) : (
            <div className="modal__action">
              <button
                className="modal__button"
                onClick={() => {
                  if (props.redirect) {
                    console.log(props.redirect);
                    props.history.push(`${props.redirect}`);
                  }
                  if (props.action) {
                    console.log(props.action);
                    props.action();
                  }
                  if (props.resetForm) {
                    props.resetForm();
                  }
                  props.dismiss();
                }}
              >
                {props.buttonText || "Continue"}
              </button>
            </div>
          )}
        </div>
      </Modal>
    )}
  />
);

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
  appState: state.appState
});

export default withRouter(connect(mapStateToProps)(ModalSm));
