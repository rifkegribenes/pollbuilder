import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";

import * as Actions from "../store/actions";
import * as apiActions from "../store/actions/apiPollActions";
import Form from "./Form";
import { onlyUnique } from "../utils/";

import logo from "../img/bot-head_340.png";

class CreatePoll extends React.Component {
  constructor(props) {
    super(props);

    this.createPoll = this.createPoll.bind(this);
  }

  componentDidMount() {}

  createPoll() {
    const token = this.props.appState.authToken;
    const body = {
      question: this.props.poll.form.question,
      options: this.props.poll.form.options
    };
    if (
      !Object.values(this.props.poll.form.validationErrors).length &&
      !this.props.poll.errorMsg
    ) {
      this.props.api
        .createPoll(token, body)
        .then(result => {
          console.log(result);
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      const { validationErrors } = this.props.poll.form;
      let errorList = "";
      // filter validation errors to find only unique values, then
      // concatenate into comma-separated string
      Object.values(validationErrors)
        .filter(onlyUnique)
        .map(error => {
          errorList += `${error}, `;
          return null;
        });
      // remove trailing comma and space from final string
      errorList = errorList.substring(0, errorList.length - 2);
      this.props.actions.setFormError({
        message: `Please resolve errors to save poll: ${errorList}`
      });
    }
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
