import React from "react";
import { withRouter, Link } from "react-router-dom";
import PropTypes from "prop-types";

const PollCardMini = props => (
  <Link
    to={`/poll/${props.poll._id}`}
    className="polls-grid__card"
    key={props.poll._id}
  >
    <div className="polls-grid__title polls-grid__title--sm">
      {props.poll.question}
    </div>
  </Link>
);

PollCardMini.propTypes = {
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
  }).isRequired
};

export default withRouter(PollCardMini);
