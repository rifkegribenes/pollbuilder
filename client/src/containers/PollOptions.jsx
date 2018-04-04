import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";

import * as Actions from "../store/actions";
import * as apiActions from "../store/actions/apiActions";

import plus from "../img/plus.svg";
import trash from "../img/delete.svg";

class PollOptions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      optionsErr: false
    };
  }

  componentDidMount() {}

  onFocus() {
    this.setState({ optionsErr: false });
  }
  editOption(event) {
    this.setState({ optionsErr: false });
    const { options } = this.props.poll.form;
    options[event.target.name] = event.target.value;
    this.props.actions.updatePollOptions(options);
  }
  addOption() {
    this.setState({ optionsErr: false });
    const { options } = this.props.poll.form;
    options.push("");
    this.props.actions.updatePollOptions(options);
  }
  deleteOption(index) {
    if (this.props.poll.form.options.length === 2) {
      this.setState({ optionsErr: true });
      return;
    }
    const { options } = this.props.poll.form;
    options.splice(index, 1);
    this.props.actions.updatePollOptions(options);
  }
  render() {
    const options = this.props.poll.form.options.map((option, index) => {
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
          <button
            className="poll__icon-button"
            onClick={() => this.deleteOption(index)}
            title="Delete"
          >
            <span className="poll__icon-wrap">
              <img className="poll__icon" src={trash} alt="" />
            </span>
          </button>
        </div>
      );
    });
    const deleteOptionError = (
      <div className="poll__options-error">
        At least two options are required
      </div>
    );
    return (
      <div className="form__input-group options-container">
        {options}
        {this.state.optionsErr ? deleteOptionError : null}
        <button
          className="poll__icon-button"
          onClick={this.addAnotherOption}
          title="Add option"
        >
          <span className="poll__icon-wrap">
            <img className="poll__icon" src={plus} alt="" />
          </span>
        </button>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  poll: state.poll
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch),
  api: bindActionCreators(apiActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(PollOptions);
