import React from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
// import editIcon from "../img/edit.svg";

const PollCard = props => (
  <button
    key={props.poll._id}
    className={
      props.owner
        ? "aria-button polls-grid__card polls-grid__card--owner"
        : "aria-button polls-grid__card"
    }
    title={
      props.owner && props.single
        ? "Edit Poll"
        : !props.single ? "View Poll" : ""
    }
    onClick={() => {
      if (props.owner && props.single) {
        props.history.push(`/edit/${props.poll._id}`);
      } else if (!props.single) {
        props.history.push(`/poll/${props.poll._id}`);
      } else {
        return null;
      }
    }}
    disabled={!props.owner}
  >
    <div className="polls-grid__title">{props.poll.question}</div>
    {props.poll.options[0].text !== "" &&
      props.poll.options.map((option, idx) => (
        <div key={option._id} className="polls-grid__option">
          {option._id !== undefined && option.text}
        </div>
      ))}
  </button>
);

PollCard.propTypes = {
  poll: PropTypes.shape({
    _id: PropTypes.string,
    question: PropTypes.string,
    options: PropTypes.arrayOf(
      PropTypes.shape({
        text: PropTypes.string,
        _id: PropTypes.string
      })
    ),
    ownerId: PropTypes.string,
    ownerName: PropTypes.string
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func
  }).isRequired,
  owner: PropTypes.bool.isRequired,
  single: PropTypes.bool
};

export default withRouter(PollCard);
