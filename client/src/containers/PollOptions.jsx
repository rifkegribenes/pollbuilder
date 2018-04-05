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
    console.log("delete");
    if (this.props.poll.form.options.length === 2) {
      console.log("show error");
      console.log(
        `this.props.poll.form.options.length: ${
          this.props.poll.form.options.length
        }`
      );
      this.setState({ optionsErr: true });
      return;
    }
    const { options } = this.props.poll.form;
    options.splice(index, 1);
    this.props.actions.updatePollOptions(options);
  }

  dismissError() {
    this.setState({ optionsErr: false });
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
            name={index.toString()}
            type="text"
          />
          <button
            className="poll__icon-button"
            onClick={() => this.deleteOption(index)}
            title="Delete"
            type="button"
          >
            <span className="poll__icon-wrap">&times;</span>
          </button>
        </div>
      );
    });
    return (
      <div className="form__input-group options-container">
        {options}
        {this.state.optionsErr && (
          <div className="form__input-group">
            <div className="error">
              <button
                className="poll__icon-button poll__icon-button--error"
                onClick={() => this.dismissError()}
                title="Close"
                type="button"
              >
                <span className="poll__icon-wrap">&times;</span>
              </button>
              At least two options are required
            </div>
          </div>
        )}
        <div className="poll__button-wrap">
          <button
            className="form__button poll__add"
            onClick={this.addAnotherOption}
            type="button"
          >
            Add option
          </button>
        </div>
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
