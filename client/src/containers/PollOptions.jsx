import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";

import * as Actions from "../store/actions";
import * as apiActions from "../store/actions/apiActions";

class PollOptions extends React.Component {
  componentDidMount() {}

  onFocus() {
    this.setState({ twoOptionsOrMoreError: false });
  }
  editOption(event) {
    this.setState({ twoOptionsOrMoreError: false });
    let updatedOptions = this.props.poll.newPollOptions;
    updatedOptions[event.target.name] = event.target.value;
    this.props.dispatchUpdateOption(updatedOptions);
  }
  addAnotherOption() {
    this.setState({ twoOptionsOrMoreError: false });
    let updatedNewOptions = this.props.poll.newPollOptions;
    updatedNewOptions.push("");
    console.log("updatedNewOptions", updatedNewOptions);
    this.props.dispatchUpdateOption(updatedNewOptions);
  }
  deleteOption(index) {
    if (this.props.poll.newPollOptions.length === 2) {
      this.setState({ twoOptionsOrMoreError: true });
      return;
    }
    let updatedDeleteOptions = this.props.poll.newPollOptions;
    updatedDeleteOptions.splice(index, 1);
    this.props.dispatchUpdateOption(updatedDeleteOptions);
  }
  render() {
    let options = this.props.poll.newPollOptions.map((option, index) => {
      return (
        <div key={index}>
          <input
            type="text"
            value={option}
            name={index}
            placeholder={`Option ${index + 1}`}
            onChange={this.editOption}
            onFocus={this.onFocus}
            className="form-control option-input"
          />
          <a
            className="btn btn-danger delete-button"
            onClick={() => this.deleteOption(index)}
            aria-label="Delete"
          >
            <i className="fa fa-trash-o" aria-hidden="true" />
          </a>
        </div>
      );
    });
    const deleteOptionError = (
      <div className="row two-or-more-error">
        <i className="fa fa-exclamation-triangle" aria-hidden="true" /> At least
        two options are required
      </div>
    );
    return (
      <div className="form-group options-container">
        {options}
        {this.state.twoOptionsOrMoreError ? deleteOptionError : null}
        <a>
          <p
            className="add-another-option show-mouse-pointer"
            onClick={this.addAnotherOption}
          >
            <i className="fa fa-plus-circle" aria-hidden="true" /> Add another
            option
          </p>
        </a>
      </div>
    );
  }
}

export default PollOptions;
