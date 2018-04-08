import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";

import * as Actions from "../store/actions";
import * as apiActions from "../store/actions/apiActions";
import FormInput from "./FormInput";

import { pollOptionsValidation } from "../utils/";

class PollOptions extends React.Component {
  constructor(props) {
    super(props);

    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.editOption = this.editOption.bind(this);
    this.addOption = this.addOption.bind(this);
    this.deleteOption = this.deleteOption.bind(this);
  }

  componentDidMount() {}

  onFocus(e) {
    const field = e.target.name;
    this.props.actions.setFormError({ message: null });
    this.props.actions.setShowError(e.target.name, false);
    const validationErrors = { ...this.props.poll.form.validationErrors };
    delete validationErrors[field];
    this.props.actions.setValidationErrors({ ...validationErrors });
    this.props.actions.showFormError(false);
  }

  onBlur(e) {
    // check if options are unique
    const { options } = this.props.poll.form;
    const field = e.target.name;
    const validationErrors = pollOptionsValidation(
      this.props.poll.form.validationErrors,
      options,
      field
    );
    const showFormError = !!Object.values(validationErrors).length;

    this.props.actions.setTouched(field);

    if (showFormError) {
      this.props.actions.setShowError(field, true);
      this.props.actions.setValidationErrors({ ...validationErrors });
      this.props.actions.showFormError(true);
    }
  }

  editOption(event) {
    this.props.actions.setFormError({ message: null });
    const { options } = this.props.poll.form;
    options[event.target.name].text = event.target.value;
    this.props.actions.setOption(options);
  }

  addOption() {
    this.props.actions.setFormError({ message: null });
    const { options } = this.props.poll.form;
    options.push({ text: "" });
    this.props.actions.setOption(options);
  }

  deleteOption(index) {
    if (this.props.poll.form.options.length === 2) {
      this.props.actions.setFormError({
        message: "At least two options are required"
      });
      return;
    } else {
      this.props.actions.deleteOption(
        this.props.poll.form.options,
        this.props.poll.form.validationErrors,
        index
      );
    }
  }

  dismissError() {
    this.props.actions.setFormError({ message: null });
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
                    handleBlur={this.onBlur}
                    label={`Option ${index + 1}`}
                    placeholder={`Option ${index + 1}`}
                    value={option.text}
                    name={index.toString()}
                    showError={
                      this.props.poll.form.showFieldErrors[index.toString()]
                    }
                    errorText={this.props.poll.form.validationErrors[index]}
                    touched={this.props.poll.form.touched[index.toString()]}
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
        {this.props.poll.errorMsg && (
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
              {this.props.poll.errorMsg}
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
      options: PropTypes.arrayOf(
        PropTypes.shape({
          text: PropTypes.string
        })
      ).isRequired
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
