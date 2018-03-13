import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";

import * as Actions from "../store/actions";
import * as apiActions from "../store/actions/apiActions";
import Spinner from "./Spinner";
import ModalSm from "./ModalSm";

class Validate extends React.Component {
  /*
  * If already logged in, refresh the token, then display the success message
  * If not logged in, try to validate the localStorage token
  * If localStorage fails, force login with a specific message
  */
  componentDidMount() {
    const body = {
      key: this.props.match.params.key
    };
    console.log("Validate component");
    this.props.api.validate(body).then(result => {
      if (result === "VALIDATE_SUCCESS") {
        console.log("validate success");
      }
    });
  }

  render() {
    let valStatus;
    if (this.props.login.tokenRefreshComplete === undefined) {
      valStatus = "Validating...";
    } else if (!this.props.profile.user.profile.validated) {
      valStatus = "Validation Failed";
    } else {
      valStatus = "Welcome!";
    }
    return (
      <div className="container validate">
        <h2 className="validate__title">{valStatus}</h2>
        {this.props.profile.user.profile.validated && (
          <div className="validate__text-wrap">
            <div className="validate__text-header">
              {`Congratulations ${this.props.profile.user.profile.firstName}!`}
            </div>
            <div className="validate__text">
              <p>Your account is now validated.</p>
            </div>
          </div>
        )}
        <Spinner cssClass={this.props.appState.spinnerClass} />
        <ModalSm
          modalClass={this.props.appState.modal.class}
          modalTitle={this.props.appState.modal.title}
          modalText={this.props.appState.modal.text}
          modalType={this.props.appState.modal.type}
          dismiss={() => {
            this.props.actions.dismissModal({
              class: "modal__hide",
              text: "",
              type: "",
              title: ""
            });
          }}
        />
      </div>
    );
  }
}

Validate.propTypes = {
  appState: PropTypes.shape({
    authToken: PropTypes.string,
    loggedIn: PropTypes.boolean
  }).isRequired,
  profile: PropTypes.shape({
    user: PropTypes.shape({
      profile: PropTypes.shape({
        firstName: PropTypes.string,
        validated: PropTypes.boolean
      }).isRequired
    }).isRequired
  }).isRequired,
  login: PropTypes.shape({
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
  }).isRequired
};

const mapStateToProps = state => ({
  appState: state.appState,
  profile: state.profile,
  login: state.login
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch),
  api: bindActionCreators(apiActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Validate);
