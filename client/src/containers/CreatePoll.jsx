import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";

import * as Actions from "../store/actions";
import * as apiActions from "../store/actions/apiActions";
import Spinner from "./Spinner";
import ModalSm from "./ModalSm";

class CreatePoll extends React.Component {
  componentDidMount() {
    // user is verified if local account email is verified
    // OR if they logged in with social auth
    if (!this.props.appState.loggedIn) {
      this.props.actions.setModalError({
        message: `Please log in to create a poll.`,
        buttonText: "Log in",
        title: "Login required",
        action: () => this.props.history.push("/login")
      });
    }
    const verified =
      this.props.appState.loggedIn && this.props.profile.user.verified;
    if (!verified) {
      if (!this.props.profile.user.profile.email) {
        // if user profile isn't already saved in app state, retrieve it
        // to use email to resend verification link
        const userId =
          this.props.profile.user._id ||
          JSON.parse(window.localStorage.getItem("userId"));
        const token =
          this.props.appState.authToken ||
          JSON.parse(window.localStorage.getItem("authToken"));
        this.props.api.getProfile(token, userId).then(result => {});
      }
    }
    if (!verified && this.props.profile.user.profile.email) {
      const email = this.props.profile.user.profile.email;
      const body = { email };
      this.props.actions.setModalError({
        message: `You must verify your email before you can create a poll.\nClick below to send a new verification link to ${
          this.props.profile.user.profile.email
        }`,
        buttonText: "Send verification link",
        title: "Email verification required",
        action: () => {
          this.props.api.resendVerificationLink(body);
        }
      });
    }
  }

  render() {
    return (
      <div className="container poll">
        <h2 className="poll__title">Create Poll</h2>
        <Spinner cssClass={this.props.poll.spinnerClass} />
        <ModalSm
          modalClass={this.props.poll.modal.class}
          modalTitle={this.props.poll.modal.title}
          modalText={this.props.poll.modal.text}
          modalType={this.props.poll.modal.type}
          buttonText={this.props.poll.modal.buttonText}
          action={this.props.poll.modal.action}
          dismiss={() => {
            this.props.actions.dismissModal({
              class: "modal__hide",
              text: "",
              title: ""
            });
            this.props.actions.setSpinner("hide");
            if (this.props.poll.modal.redirect) {
              this.props.history.push(this.props.poll.modal.redirect);
            }
          }}
          redirect={this.props.poll.modal.redirect}
        />
      </div>
    );
  }
}

CreatePoll.propTypes = {
  appState: PropTypes.shape({
    authToken: PropTypes.string,
    loggedIn: PropTypes.boolean
  }).isRequired,
  profile: PropTypes.shape({
    user: PropTypes.shape({
      profile: PropTypes.shape({
        firstName: PropTypes.string,
        email: PropTypes.string
      }).isRequired,
      verified: PropTypes.boolean
    }).isRequired
  }).isRequired,
  poll: PropTypes.shape({
    spinnerClass: PropTypes.string,
    modal: PropTypes.shape({
      class: PropTypes.string,
      type: PropTypes.string,
      title: PropTypes.string,
      text: PropTypes.string
    })
  }).isRequired,
  api: PropTypes.shape({
    refreshToken: PropTypes.func,
    validateToken: PropTypes.func
  }).isRequired,
  actions: PropTypes.shape({
    setModalError: PropTypes.func,
    setRedirectUrl: PropTypes.func,
    dismissModal: PropTypes.func
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func
  }).isRequired
};

const mapStateToProps = state => ({
  appState: state.appState,
  profile: state.profile,
  poll: state.poll
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch),
  api: bindActionCreators(apiActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(CreatePoll);