import React from "react";
// import { parse } from 'query-string';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as apiActions from "../store/actions/apiActions";

class FBCallback extends React.Component {
  componentWillMount() {
    console.log(`loggedIn: ${this.props.appState.loggedIn}`);
  }

  componentDidMount() {
    // console.log(window.location.pathname);
    // this.props.api.callbackFacebook()
    //   .then(result => console.log(result));
  }

  render() {
    return <div>FBCallback</div>;
  }
}

const mapStateToProps = state => ({
  appState: state.appState
});

const mapDispatchToProps = dispatch => ({
  api: bindActionCreators(apiActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(FBCallback);
