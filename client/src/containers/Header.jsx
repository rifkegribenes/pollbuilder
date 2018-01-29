import React from "react";
import { Link } from "react-router-dom";

const Header = props => (
  <header className="header">
    <p>Header</p>
    <Link className="nav__link" to="/login">
      Login
    </Link>
  </header>
);

export default Header;
