import React from "react";
import { parse } from "query-string";
import { connect } from "react-redux";
// import { bindActionCreators } from "redux";
import * as apiActions from "../store/actions/apiActions";

class Verify extends React.Component {
  componentWilMount() {
    console.log(`loggedIn: ${this.props.appState.loggedIn}`);
  }

  componentDidMount() {
    console.log(window.location.pathname);
  }

  render() {
    return <div>Verify Account</div>;
  }
}

const mapStateToProps = state => ({
  appState: state.appState
});

// const mapDispatchToProps = dispatch => ({
//   api: bindActionCreators(apiActions, dispatch)
// });

export default connect(mapStateToProps)(Verify);
