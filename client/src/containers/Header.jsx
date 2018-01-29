import React from 'react';
import { Link } from 'react-router-dom';

const Header = props => (
  <div className="container">
    <p>Header</p>
    <Link className="nav__link" to="/login">
        Login
    </Link>
  </div>
);

export default Header;