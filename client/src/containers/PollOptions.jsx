import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";

import * as Actions from "../store/actions";
import * as apiActions from "../store/actions/apiActions";
import FormInput from "./FormInput";

class PollOptions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      optionsErr: false
    };

    this.onFocus = this.onFocus.bind(this);
    this.editOption = this.editOption.bind(this);
    this.addOption = this.addOption.bind(this);
    this.deleteOption = this.deleteOption.bind(this);
  }

  componentDidMount() {}

  onFocus() {
    this.setState({ optionsErr: false });
  }

  editOption(event) {
    this.setState({ optionsErr: false });
    const { options } = this.props.poll.form;
    options[event.target.name] = event.target.value;
    this.props.actions.setOption(options);
  }

  addOption() {
    this.setState({ optionsErr: false });
    const { options } = this.props.poll.form;
    options.push("");
    this.props.actions.setOption(options);
  }

  deleteOption(index) {
    if (this.props.poll.form.options.length === 2) {
      this.setState({ optionsErr: true });
      return;
    } else {
      this.props.actions.deleteOption(this.props.poll.form.options, index);
    }
  }

  dismissError() {
    this.setState({ optionsErr: false });
  }

  render() {
    return (
      <div className="form__input-group options-container">
        {this.props.poll.form.options.map((option, index) => {
          return (
            <div key={`Option ${index + 1}`}>
              {index <= this.props.poll.form.options.length && (
                <div className="form__input-group poll__option-group">
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
              )}
            </div>
          );
        })}
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
            onClick={() => this.addOption()}
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
    setOption: PropTypes.func
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
