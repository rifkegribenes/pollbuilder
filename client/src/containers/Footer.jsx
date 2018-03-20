import React from "react";

const Footer = props => (
  <footer className="footer">
    &copy; 2018 Sarah Schneider
    <div className="footer__right">
      <a
        href="https://github.com/rifkegribenes/voting-app"
        data-taborder=""
        rel="noopener noreferrer"
        target="_blank"
        className="footer__link"
      >
        <i className="fa fa-github footer__icon" />
      </a>
    </div>
  </footer>
);

export default Footer;
