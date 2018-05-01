import React from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";
import * as Actions from "../store/actions";
import * as apiActions from "../store/actions/apiPollActions";
import * as apiActions2 from "../store/actions/apiActions";

import Spinner from "./Spinner";
import ModalSm from "./ModalSm";
import PollCardMini from "./PollCardMini";
// import editIcon from "../img/edit.svg";

class UserPolls extends React.Component {
  componentWillMount() {
    let userId;
    if (!this.props.match.params.id) {
      userId =
        this.props.profile.user._id ||
        JSON.parse(window.localStorage.getItem("userId"));
    } else {
      userId = this.props.match.params.id;
    }
    console.log(userId);
    this.props.api.getUserPolls(userId).then(result => {
      // console.log(result);
      if (result.type === "GET_USER_POLLS_SUCCESS") {
        console.log(this.props.poll.polls);
        // if the user has no polls, need to get the users's name
        // for the empty content message
        if (!this.props.poll.polls.length) {
          this.props.api2.getPartialProfile(userId).then(result => {
            // console.log(result);
          });
        }
      }
    });
  }

  render() {
    const owner =
      !this.props.match.params.id ||
      this.props.match.params.id === this.props.profile.user._id;
    const polls = this.props.poll.polls.map(poll => (
      <PollCardMini key={poll._id} poll={poll} history={this.props.history} />
    ));
    let backgroundStyle;
    if (!owner && !this.props.poll.polls.length) {
      backgroundStyle = {
        backgroundImage: `url(${this.props.poll.form.ownerAvatar ||
          "https://raw.githubusercontent.com/rifkegribenes/pollbuilder/master/client/public/img/pollbuilder_icon.png"})`,
        backgroundSize: "cover",
        backgroundPosition: "center center"
      };
    }
    if (this.props.poll.polls.length) {
      backgroundStyle = {
        backgroundImage: `url(${this.props.poll.polls[
          this.props.poll.polls.length - 1
        ].ownerAvatar ||
          "https://raw.githubusercontent.com/rifkegribenes/pollbuilder/master/client/public/img/pollbuilder_icon.png"})`,
        backgroundSize: "cover",
        backgroundPosition: "center center"
      };
    }
    return (
      <div className="container">
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
        {this.props.poll.polls.length ? (
          <div>
            <div className="polls-grid__header">
              <div className="h-nav__image-aspect polls-grid__avatar--empty">
                <div className="h-nav__image-crop">
                  <div
                    className="h-nav__image"
                    style={backgroundStyle}
                    role="img"
                    aria-label={this.props.poll.polls[0].ownerName}
                  />
                </div>
              </div>
              All Polls by {this.props.poll.polls[0].ownerName}
            </div>
            <div className="polls-grid">{polls}</div>
          </div>
        ) : (
          <div className="polls-grid__empty">
            {!owner ? (
              <div>
                <div className="h-nav__image-aspect polls-grid__avatar--empty">
                  <div className="h-nav__image-crop">
                    <div
                      className="h-nav__image"
                      style={backgroundStyle}
                      role="img"
                      aria-label={this.props.poll.form.ownerName}
                    />
                  </div>
                </div>
                <div>
                  {this.props.poll.form.ownerName} hasn't made any polls yet.
                  (user {this.props.poll.form.ownerId})
                </div>
              </div>
            ) : owner && !this.props.appState.loggedIn ? (
              <div>
                <strong>
                  <Link to="/login" className="link polls-grid__link">
                    Log in
                  </Link>
                </strong>{" "}
                to view your polls.
              </div>
            ) : (
              <div>
                You haven't made any polls yet.{" "}
                <strong>
                  <Link to="/createPoll" className="link polls-grid__link">
                    Make a poll here.
                  </Link>
                </strong>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

UserPolls.propTypes = {
  appState: PropTypes.shape({
    loggedIn: PropTypes.bool,
    authToken: PropTypes.string
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
    viewPoll: PropTypes.func,
    deletePoll: PropTypes.func
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
  api: bindActionCreators(apiActions, dispatch),
  api2: bindActionCreators(apiActions2, dispatch)
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(UserPolls)
);
