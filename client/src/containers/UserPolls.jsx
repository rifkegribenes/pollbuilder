import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";
import * as Actions from "../store/actions";
import * as apiActions from "../store/actions/apiPollActions";

import Spinner from "./Spinner";
import ModalSm from "./ModalSm";
import PollCard from "./PollCard";
// import editIcon from "../img/edit.svg";

class UserPolls extends React.Component {
  componentWillMount() {
    const token =
      this.props.appState.authToken ||
      JSON.parse(window.localStorage.getItem("authToken"));
    const userId =
      this.props.profile.user._id ||
      JSON.parse(window.localStorage.getItem("userId"));
    this.props.api.getUserPolls(token, userId).then(result => {
      // console.log(result);
      if (result.type === "GET_USER_POLLS_SUCCESS") {
        this.props.actions.setLoggedIn();
      }
    });
  }

  render() {
    const polls = this.props.poll.polls.map(poll => (
      <PollCard
        key={poll._id}
        owner={true}
        poll={poll}
        history={this.props.history}
      />
    ));
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
        <div className="polls-grid">{polls}</div>
      </div>
    );
  }
}

UserPolls.propTypes = {
  appState: PropTypes.shape({
    loggedIn: PropTypes.bool
  }).isRequired,
  profile: PropTypes.shape({
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
  poll: state.poll,
  profile: state.profile
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch),
  api: bindActionCreators(apiActions, dispatch)
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(UserPolls)
);
