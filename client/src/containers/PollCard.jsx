import React from "react";
import { withRouter, Link } from "react-router-dom";
import PropTypes from "prop-types";


import Chart from "./Chart";
import editIcon from "../img/edit.svg";
import deleteIcon from "../img/delete.svg";
import twIcon from "../img/twitter.svg";
import fbIcon from "../img/facebook-white.svg";
import tmIcon from "../img/tumblr.svg";

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
  const legendCallback = chart => {
    return (
      <ul className="polls-grid__legend">
        {chart.data.datasets[0].data.map((item, idx) => (
          <li className="polls-grid__legend--li" key={idx}>
            <span
              className="polls-grid__legend--bar"
              style={{
                backgroundColor: chart.data.datasets[0].backgroundColor[idx],
                height: "20px",
                width: "60px"
              }}
            />
            <span className="polls-grid__legend--label">
              {chart.data.labels[idx]}
            </span>
          </li>
        ))}
      </ul>
    );
  };

  const chartOptions = {
    legend: { display: false },
    legendCallback,
    maintainAspectRatio: true
  };

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
          "rgba(250, 171, 79, 1)", // mango
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

  const backgroundStyle = {
    backgroundImage: `url(${props.poll.ownerAvatar ||
      "https://raw.githubusercontent.com/rifkegribenes/pollbuilder/master/client/public/img/pollbuilder_icon.png"})`,
    backgroundSize: "cover",
    backgroundPosition: "center center"
  };
  const canonicalUrl = encodeURIComponent(`https://pollbuilder.glitch.me/poll/${props.poll._id}`);
  const questionUriEncoded = encodeURIComponent(props.poll.question);
  const tumblrUrl = `https://www.tumblr.com/widgets/share/tool?canonicalUrl=${canonicalUrl}&posttype=link&description=${questionUriEncoded}&caption=${questionUriEncoded}`
  
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
            <Chart data={chartData} options={chartOptions} />
          </div>
        </div>
        <div className="polls-grid__icon-wrap">
          <a
            className="form__button polls-grid__btn--icon"
            href={`http://www.facebook.com/sharer.php?u=${canonicalUrl}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              className="form__icon polls-grid__icon"
              alt="facebook"
              src={fbIcon}
            />
          </a>
          <a
            className="form__button polls-grid__btn--icon"
            href={`https://twitter.com/share?url=${canonicalUrl}&text=${questionUriEncoded}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              className="form__icon polls-grid__icon"
              alt="twitter"
              src={twIcon}
            />
          </a>
          <a
            className="form__button polls-grid__btn--icon"
            href={tumblrUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              className="form__icon polls-grid__icon"
              alt="tumblr"
              src={tmIcon}
            />
          </a>
        </div>
        {props.owner ? (
          <div className="polls-grid__admin-buttons">
            <button
              className="form__button polls-grid__btn--icon polls-grid__edit"
              title="Edit poll"
              onClick={() => props.history.push(`/edit/${props.poll._id}`)}
            >
              <img
                className="form__icon polls-grid__icon"
                alt=""
                src={editIcon}
              />
            </button>
            <button
              className="form__button polls-grid__btn--icon"
              title="Delete poll"
              onClick={() =>
                props.setModalError(
                  deleteModal(props.poll._id, props.token, props.deletePoll)
                )
              }
            >
              <img
                className="form__icon polls-grid__icon"
                alt=""
                src={deleteIcon}
              />
            </button>
          </div>
        ) : (
          <Link
            to={`/userpolls/${props.poll.ownerId}`}
            className="h-nav__image-aspect polls-grid__avatar"
          >
            <div className="h-nav__image-crop">
              <div
                className="h-nav__image"
                style={backgroundStyle}
                role="img"
                aria-label={props.poll.ownerName}
              />
            </div>
          </Link>
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
