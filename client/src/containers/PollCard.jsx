import React from "react";
import { withRouter, Link } from "react-router-dom";
import PropTypes from "prop-types";
import editIcon from "../img/edit.svg";
import deleteIcon from "../img/delete.svg";

const deleteModal = (pollId, token, deletePoll) => {
  return {
    title: "Confirm Delete",
    buttonText: "Delete",
    action: () => deletePoll(token, pollId),
    message: "Are you sure you want to delete this poll? This cannot be undone."
  };
};

const PollCard = props => (
  <div
    key={props.poll._id}
    className={
      props.owner
        ? "aria-button polls-grid__card polls-grid__card--owner"
        : "aria-button polls-grid__card"
    }
  >
    {props.single ? (
      <div className="polls-grid__title">{props.poll.question}</div>
    ) : (
      <Link to={`/poll/${props.poll._id}`}>
        <div className="polls-grid__title">{props.poll.question}</div>
      </Link>
    )}
    {props.poll.options[0].text !== "" &&
      props.poll.options.map((option, idx) => (
        <div key={option._id || idx} className="polls-grid__option">
          {option._id !== undefined && option.text}
        </div>
      ))}
    {props.owner &&
      props.single && (
        <div className="polls-grid__admin-buttons">
          <button
            className="aria-button polls-grid__admin polls-grid__edit"
            title="Edit poll"
            onClick={() => props.history.push(`/edit/${props.poll._id}`)}
          >
            <img src={editIcon} className="polls-grid__icon" alt="" />
          </button>
          <button
            className="aria-button polls-grid__admin polls-grid__delete"
            title="Delete poll"
            onClick={() =>
              props.setModalError(
                deleteModal(props.poll._id, props.token, props.deletePoll)
              )
            }
          >
            <img src={deleteIcon} className="polls-grid__icon" alt="" />
          </button>
        </div>
      )}
  </div>
);

PollCard.propTypes = {
  token: PropTypes.string.isRequired,
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
  deletePoll: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func
  }).isRequired,
  owner: PropTypes.bool.isRequired,
  single: PropTypes.bool,
  setModalError: PropTypes.func
};

export default withRouter(PollCard);
