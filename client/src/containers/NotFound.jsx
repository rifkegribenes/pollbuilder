import React from "react";
import { NavLink } from "react-router-dom";
import notFound from "../img/404.svg";

const NotFound = props => {
  console.log(`not found: ${window.location.href}`);
  return (
    <div className="container not-found">
      <img
        src={notFound}
        className="not-found__image"
        alt="404 error. Sorry, page not found."
      />
      <div className="not-found__button-wrap">
        <NavLink
          to="/"
          className="form__button form__button--big not-found__button"
        >
          Take me home!
        </NavLink>
      </div>
    </div>
  );
};

export default NotFound;
