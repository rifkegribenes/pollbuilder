import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";
import * as Actions from "../store/actions";
import * as apiActions from "../store/actions/apiPollActions";

import Spinner from "./Spinner";
import ModalSm from "./ModalSm";
import editIcon from "../img/edit.svg";

class ViewPoll extends React.Component {
  componentWillMount() {
    const token =
      this.props.appState.authToken ||
      JSON.parse(window.localStorage.getItem("authToken"));
    const pollId = this.props.match.params.id;
    console.log(token);
    console.log(pollId);
    // retrieve requested & save to app state
    this.props.api.viewPoll(token, pollId).then(result => {
      console.log(result);
      if (result.type === "GET_POLL_SUCCESS") {
        console.log(this.props.appState.poll.form);
      }
    });
  }

  render() {
    console.log(this.props.poll.form.options);
    let options = {};
    if (this.props.poll.form.options[0].text !== "") {
      options = this.props.poll.form.options.map((option, idx) => {
        return (
          <div>
            {option._id !== undefined && (
              <button
                key={`${option._id}`}
                className={`aria-button profile__email ${option._id}`}
                title="Edit option"
                onClick={() => console.log("edit option")}
              >
                {option.text}
                <span className="profile__edit">
                  <img className="profile__icon" src={editIcon} alt="" />
                </span>
              </button>
            )}
          </div>
        );
      });
    }
    console.log(options);
    return (
      <div>
        <Spinner cssClass={this.props.poll.spinnerClass} />
        <ModalSm
          modalClass={this.props.poll.modal.class}
          modalText={this.props.poll.modal.text}
          modalType={this.props.poll.modal.type}
          modalTitle={this.props.poll.modal.title}
          inputName={this.props.poll.modal.inputName}
          inputPlaceholder={this.props.poll.modal.inputPlaceholder}
          inputLabel={this.props.poll.modal.inputLabel}
          inputType={this.props.poll.modal.inputType}
          buttonText={this.props.poll.modal.buttonText}
          dismiss={() => {
            this.props.actions.dismissModal();
            if (this.props.poll.modal.type === "modal__error") {
              this.props.history.push("/login");
            }
          }}
          redirect={this.props.poll.modal.redirect}
          action={() => {
            if (this.props.poll.modal.action) {
              this.props.poll.modal.action();
            } else {
              this.props.actions.dismissModal();
              if (this.props.poll.modal.type === "modal__error") {
                this.props.history.push("/login");
              }
            }
          }}
        />
        <div className="container profile">
          <div className="profile__card">
            <button
              className="aria-button profile__name"
              title="Edit question"
              onClick={() => console.log("edit question")}
            >
              {this.props.poll.form.question}
              <span className="profile__edit">
                <img className="profile__icon" src={editIcon} alt="" />
              </span>
            </button>
            {options}
          </div>
        </div>
      </div>
    );
  }
}

ViewPoll.propTypes = {
  appState: PropTypes.shape({
    loggedIn: PropTypes.bool,
    user: PropTypes.shape({
      _id: PropTypes.string
    })
  }).isRequired,
  actions: PropTypes.shape({
    setLoggedIn: PropTypes.func,
    dismissModal: PropTypes.func
  }).isRequired,
  api: PropTypes.shape({
    viewPoll: PropTypes.func
  }).isRequired,
  poll: PropTypes.shape({
    form: PropTypes.shape({
      question: PropTypes.string,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          text: PropTypes.string,
          _id: PropTypes.string
        })
      )
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
  appState: state.appState,
  poll: state.poll
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch),
  api: bindActionCreators(apiActions, dispatch)
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ViewPoll)
);