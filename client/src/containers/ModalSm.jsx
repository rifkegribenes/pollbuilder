import React from "react";
import { connect } from "react-redux";

import PropTypes from "prop-types";

import Modal from "react-modal";

const modalStyles = {
  overlay: { zIndex: 3, background: "rgba(0,0,0,.7)" },
  content: { background: "transparent", border: 0 }
};
const app = document.getElementById("app");

const ModalSm = props => (
  <Modal
    style={modalStyles}
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
            onClick={props.action || props.dismiss}
          >
            Continue
          </button>
        </div>
      )}
    </div>
  </Modal>
);

ModalSm.propTypes = {
  modalClass: PropTypes.string.isRequired,
  modalText: PropTypes.string.isRequired,
  modalType: PropTypes.string,
  modalTitle: PropTypes.string,
  action: PropTypes.func,
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
