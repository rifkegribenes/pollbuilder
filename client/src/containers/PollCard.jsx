import React from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { Doughnut } from "react-chartjs-2";

import editIcon from "../img/edit.svg";
import deleteIcon from "../img/delete.svg";

const deleteModal = (pollId, token, deletePoll) => {
  return {
    title: "Confirm Delete",
    buttonText: "Delete",
    modalDanger: true,
    action: () => deletePoll(token, pollId),
    message: "Are you sure you want to delete this poll? This cannot be undone."
  };
};

const PollCard = props => {
  const chartData = {
    labels: props.poll.options.map(option => option.text),
    datasets: [
      {
        label: "Votes",
        data: props.poll.options.map(option => option.votes),
        backgroundColor: [
          "rgba(130, 63, 178, 1)", // grape
          "rgba(168, 54, 136, 1)",
          "rgba(224, 41, 72, 1)", // raspberry
          "rgba(250, 76, 53, 1)",
          "rgba(250, 124, 66, 1)",
          "rgba(250, 171, 79, 1)" // mango
        ],
        borderColor: ["#ffffff"],
        borderWidth: 1
      }
    ]
  };
  const chartOptions = {
    legend: {
      position: "right"
    }
  };
  return (
    <div key={props.poll._id}>
      <div
        className={
          props.owner
            ? "polls-grid__card polls-grid__card--single polls-grid__card--owner"
            : "polls-grid__card polls-grid__card--single"
        }
      >
        <div className="polls-grid__title">{props.poll.question}</div>
        <div className="polls-grid__inner-wrap">
          <div className="polls-grid__options-wrap">
            {props.poll.options[0].text !== "" &&
              props.poll.options.map((option, idx) => (
                <button
                  key={option._id || idx}
                  className="polls-grid__option form__button"
                  onClick={() => {
                    const body = { ...props.poll };
                    props.vote(props.poll._id, option._id, body);
                  }}
                >
                  {option._id !== undefined && option.text}
                </button>
              ))}
          </div>
          <div className="polls-grid__chart-wrap">
            <Doughnut data={chartData} options={chartOptions} />
          </div>
        </div>
        {props.owner && (
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
    </div>
  );
};

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
  setModalError: PropTypes.func,
  vote: PropTypes.func,
  voted: PropTypes.bool
};

export default withRouter(PollCard);
