import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";

import * as Actions from "../store/actions";
import * as apiActions from "../store/actions/apiPollActions";
import Form from "./Form";

import logo from "../img/bot-head_340.png";

class CreatePoll extends React.Component {
  constructor(props) {
    super(props);

    this.createPoll = this.createPoll.bind(this);
  }

  componentDidMount() {
    // TODO: y i k e s  fix this mess.....
    // user is verified if local account email is verified
    // OR if they logged in with social auth
    //   if (!this.props.appState.loggedIn) {
    //     this.props.actions.setModalError({
    //       message: `Please log in to create a poll.`,
    //       buttonText: "Log in",
    //       title: "Login required",
    //       action: () => this.props.history.push("/login"),
    //       redirect: "/login"
    //     });
    //   }
    //   const verified =
    //     this.props.appState.loggedIn && this.props.profile.user.verified;
    //   if (!verified) {
    //     if (!this.props.profile.user.profile.email) {
    //       // if user profile isn't already saved in app state, retrieve it
    //       // to use email to resend verification link
    //       const userId =
    //         this.props.profile.user._id ||
    //         JSON.parse(window.localStorage.getItem("userId"));
    //       const token =
    //         this.props.appState.authToken ||
    //         JSON.parse(window.localStorage.getItem("authToken"));
    //       this.props.api.getProfile(token, userId).then(result => {});
    //     }
    //   }
    //   if (!verified && this.props.profile.user.profile.email) {
    //     const email = this.props.profile.user.profile.email;
    //     const body = { email };
    //     this.props.actions.setModalError({
    //       message: `You must verify your email before you can create a poll.\nClick below to send a new verification link to ${
    //         this.props.profile.user.profile.email
    //       }`,
    //       buttonText: "Send verification link",
    //       title: "Email verification required",
    //       action: () => {
    //         this.props.api.resendVerificationLink(body);
    //       }
    //     });
    //   }
  }

  createPoll() {
    console.log("createPoll");
    const token = this.props.appState.authToken;
    const body = {
      question: this.props.poll.form.question,
      options: this.props.poll.form.options,
      ownerID: this.props.profile.user._id,
      ownerName: `${this.props.profile.user.firstName} ${
        this.props.profile.user.lastName
      }`
    };
    console.log(body);
    console.log(token);
    this.props.api
      .createPoll(token, body)
      .then(result => {
        console.log(result);
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    const fields = [
      {
        name: "question",
        label: "Question",
        autoComplete: "",
        type: "text",
        placeholder: "What's your favorite ice cream flavor?"
      }
    ];
    return (
      <div>
        <div className="container combo">
          <div className="combo__header">
            <div className="combo__logo-wrap">
              <img className="combo__logo" src={logo} alt="surveybot" />
            </div>
            <div className="combo__title">Create Poll</div>
          </div>
          <div className="combo__form">
            <Form
              fields={fields}
              reducer="poll"
              form="create"
              buttonText="Create Poll"
              formAction={this.createPoll}
            />
          </div>
        </div>
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
      _id: PropTypes.string,
      profile: PropTypes.shape({
        firstName: PropTypes.string,
        lastName: PropTypes.string,
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
    createPoll: PropTypes.func
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
