import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";

import * as Actions from "../store/actions";
import * as apiActions from "../store/actions/apiActions";
import FormInput from "./FormInput";

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
        <div className="form__input-group poll__option-group" key={index}>
          <FormInput
            handleChange={this.editOption}
            handleFocus={this.onFocus}
            label={`Option ${index + 1}`}
            placeholder={`Option ${index + 1}`}
            value={option}
            name={index}
            type="text"
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
          className="poll__icon-button poll__icon--plus"
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

PollOptions.propTypes = {
  actions: PropTypes.shape({
    dismissModal: PropTypes.func,
    setFormField: PropTypes.func,
    setFormError: PropTypes.func,
    clearFormError: PropTypes.func,
    updatePollOptions: PropTypes.func
  }).isRequired,
  api: PropTypes.shape({
    resetPassword: PropTypes.func
  }).isRequired,
  poll: PropTypes.shape({
    form: PropTypes.shape({
      options: PropTypes.arrayOf(PropTypes.string).isRequired
    })
  })
};

const mapStateToProps = state => ({
  poll: state.poll
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch),
  api: bindActionCreators(apiActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(PollOptions);
