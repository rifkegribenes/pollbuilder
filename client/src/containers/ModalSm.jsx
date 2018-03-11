import React from "react";
import { connect } from "react-redux";

import PropTypes from "prop-types";

import Modal from "react-modal";

const app = document.getElementById("app");

const ModalSm = props => (
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
              stroke-width="6"
              stroke-miterlimit="10"
              cx="65.1"
              cy="65.1"
              r="62.1"
            />
            <polyline
              class="path check"
              fill="none"
              stroke="#73AF55"
              stroke-width="6"
              stroke-linecap="round"
              stroke-miterlimit="10"
              points="100.2,40.2 51.5,88.8 29.8,67.5 "
            />
          </svg>
        )}
      </div>
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
              props.dismiss();
              props.resetForm();
              if (props.redirect) {
                props.history.push(`/${props.redirect}`);
              }
            }}
          >
            {props.buttonText || "Continue"}
          </button>
        </div>
      )}
    </div>
  </Modal>
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

export default connect(mapStateToProps)(ModalSm);
