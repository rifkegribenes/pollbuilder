import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";

import * as Actions from "../store/actions";
import * as apiActions from "../store/actions/apiPollActions";
import Form from "./Form";
import { onlyUnique, pollOptionsValidation } from "../utils/";

import logo from "../img/bot-head_340.png";

class CreatePoll extends React.Component {
  constructor(props) {
    super(props);

    this.createOrUpdate = this.createOrUpdate.bind(this);
  }

  componentDidMount() {
    if (this.props.match.params.id) {
      const pollId = this.props.match.params.id;
      // retrieve requested poll & save to app state
      this.props.api.viewPoll(pollId).then(result => {
        if (result.type === "VIEW_POLL_SUCCESS") {
          // this.props.actions.setLoggedIn();
        }
      });
    } else {
      this.props.actions.resetForm();
    }
  }

  createOrUpdate(action) {
    // run error checks on all option fields
    const { options } = this.props.poll.form;
    let finalErrors = {};
    options.forEach((option, idx) => {
      finalErrors = pollOptionsValidation(finalErrors, options, idx);
    });

    if (!this.props.poll.form.question) {
      finalErrors.question = "Question is required";
    }

    if (!Object.values(finalErrors).length && !this.props.poll.errorMsg) {
      const token = this.props.appState.authToken;
      const body = {
        question: this.props.poll.form.question,
        options: this.props.poll.form.options
      };
      if (action === "create") {
        this.props.api
          .createPoll(token, body)
          .then(result => {
            // console.log(result);
          })
          .catch(err => {
            console.log(err);
          });
      } else if (action === "update") {
        body._id = this.props.match.params.id;
        body.ownerId = this.props.poll.form.ownerId;
        this.props.api
          .updatePoll(token, body)
          .then(result => {
            // console.log(result);
          })
          .catch(err => {
            console.log(err);
          });
      }
    } else {
      let errorList = "";
      // filter validation errors to find only unique values, then
      // concatenate into comma-separated string
      Object.values(finalErrors)
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
              <img className="combo__logo" src={logo} alt="pollbuilder" />
            </div>
            <div className="combo__title">
              {this.props.edit ? "Edit Poll" : "Create Poll"}
            </div>
          </div>
          <div className="combo__form">
            <Form
              fields={fields}
              reducer="poll"
              form="create"
              buttonText={this.props.edit ? "Save Poll" : "Create Poll"}
              formAction={
                this.props.edit
                  ? () => this.createOrUpdate("update")
                  : () => this.createOrUpdate("create")
              }
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
