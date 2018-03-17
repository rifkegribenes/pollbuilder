import React from "react";
import { NavLink, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as Actions from "../store/actions";

import { skip } from "../utils";
import vaIcon from "../img/rainbow_icon_120.png";

class Header extends React.Component {
  // close nav & admin menu if open during route change or on logout
  componentDidUpdate(prevProps) {
    if (
      this.props.location.pathname !== prevProps.location.pathname ||
      this.props.appState.loggedIn !== prevProps.appState.loggedIn
    ) {
      this.props.actions.setMenuState("closing");
      this.props.actions.setAdminMenuState("closing");
      setTimeout(() => {
        this.props.actions.setMenuState("closed");
        this.props.actions.setAdminMenuState("closed");
      }, 300);
    }
  }

  navToggle = () => {
    if (this.props.appState.windowSize.width < 650) {
      if (this.props.appState.menuState === "closed") {
        this.props.actions.setMenuState("open");
      } else {
        this.props.actions.setMenuState("closing");
        setTimeout(() => {
          this.props.actions.setMenuState("closed");
        }, 300);
      }
    }
  };

  adminNavToggle = () => {
    if (this.props.appState.adminMenuState === "closed") {
      this.props.actions.setAdminMenuState("open");
    } else {
      this.props.actions.setAdminMenuState("closing");
      setTimeout(() => {
        this.props.actions.setAdminMenuState("closed");
      }, 300);
    }
  };

  render() {
    const classObj = {
      closed: {
        menu: "form__button form__button--big h-nav__item-menu",
        nav: "h-nav__nav",
        ul: "h-nav",
        bar1: "h-nav__bar h-nav__bar--top",
        bar2: "h-nav__bar h-nav__bar--mid",
        bar3: "h-nav__bar h-nav__bar--bot",
        span: "h-nav__item-link--menu",
        menuspan: "h-nav__menuspan",
        ariaE: false
      },

      open: {
        menu: "aria-button h-nav__item-menu--open",
        nav: "h-nav__nav--side",
        ul: "h-nav__side",
        bar1: "h-nav__bar h-nav__bar--top h-nav__bar--top-active",
        bar2: "h-nav__bar h-nav__bar--mid h-nav__bar--mid-active",
        bar3: "h-nav__bar h-nav__bar--bot h-nav__bar--bot-active",
        span: "h-nav__item-link--menu-open",
        menuspan: "h-nav__menuspan--open",
        ariaE: true
      },

      closing: {
        menu: "aria-button h-nav__item-menu",
        nav: "h-nav__nav h-nav__nav--hidden",
        ul: "h-nav",
        bar1: "h-nav__bar h-nav__bar--top",
        bar2: "h-nav__bar h-nav__bar--mid",
        bar3: "h-nav__bar h-nav__bar--bot",
        span: "h-nav__item-link--menu",
        menuspan: "h-nav__menuspan",
        ariaE: false
      }
    };

    const avatarUrl = this.props.profile.user.profile.avatarUrl;
    const backgroundStyle = {
      backgroundImage: `url(${avatarUrl})`,
      backgroundSize: "cover",
      backgroundPosition: "center center"
    };
    let adminLinks = ["profile", "logout"];
    if (this.props.profile.user.verified) {
      adminLinks = ["profile", "polls", "logout"];
    }

    const navItemClass =
      this.props.appState.adminMenuState === "open"
        ? "a-nav__item--expanded"
        : "a-nav__item";
    const navLinkClass =
      this.props.appState.adminMenuState === "open"
        ? "a-nav__item-link a-nav__item-link--expanded"
        : "a-nav__item-link";
    const adminNavClass =
      this.props.appState.adminMenuState === "open"
        ? "a-nav__expanded"
        : "a-nav";

    return (
      <header className="header">
        <div className="h-nav__side-bkg">
          <button className="skip" onClick={() => skip("main")}>
            <span className="skip__text">Skip to content</span> &rsaquo;
          </button>
          <div
            className={classObj[this.props.appState.menuState].menu}
            aria-expanded={classObj[this.props.appState.menuState].ariaE}
            aria-controls="nav"
            tabIndex="0"
            role="button"
            onClick={this.navToggle}
          >
            <span className={classObj[this.props.appState.menuState].span}>
              <button className="h-nav__icon" data-taborder="">
                <span className="sr-only">Toggle navigation</span>
                <div className={classObj[this.props.appState.menuState].bar1} />
                <div className={classObj[this.props.appState.menuState].bar2} />
                <div className={classObj[this.props.appState.menuState].bar3} />
              </button>
              <span
                className={classObj[this.props.appState.menuState].menuspan}
              >
                Menu
              </span>
            </span>
          </div>

          <nav className={classObj[this.props.appState.menuState].nav}>
            <ul className={classObj[this.props.appState.menuState].ul}>
              <li className="h-nav__item">
                <NavLink
                  to="/"
                  className="h-nav__item-link"
                  activeClassName="h-nav__item-link--active"
                >
                  <img src={vaIcon} className="h-nav__logo" alt="logo" />
                  <span className="h-nav__logo--text">Voting App</span>
                </NavLink>
              </li>
              <li className="h-nav__item">
                <NavLink
                  to="/about"
                  className="h-nav__item-link h-nav__item-link"
                  activeClassName="h-nav__item-link--active"
                >
                  About
                </NavLink>
              </li>
              {this.props.links.map(item => {
                let classes;
                if (item === "Login") {
                  classes =
                    "form__button form__button--big h-nav__item-link--login";
                } else if (item === "logout") {
                  classes = "h-nav__item-link h-nav__item-link--logout";
                } else {
                  classes = "h-nav__item-link h-nav__item-link";
                }
                return (
                  <li className="h-nav__item" key={item}>
                    <NavLink
                      to={`/${item}`}
                      className={classes}
                      activeClassName="h-nav__item-link--active"
                    >
                      {item}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
            {this.props.appState.loggedIn && (
              <div>
                <button
                  className="h-nav__avatar aria-button"
                  data-taborder=""
                  onClick={() => this.adminNavToggle()}
                  aria-expanded={this.props.appState.adminMenuState === "open"}
                >
                  <div className="h-nav__image-aspect">
                    <div className="h-nav__image-crop">
                      <div
                        className="h-nav__image"
                        style={backgroundStyle}
                        role="img"
                        aria-label={`${
                          this.props.profile.user.profile.firstName
                        } ${this.props.profile.user.profile.lastName}`}
                      />
                    </div>
                  </div>
                </button>
                <div className="a-nav__wrap">
                  <div>
                    <ul className={adminNavClass}>
                      {adminLinks.map(item => (
                        <li className={navItemClass} key={item}>
                          <NavLink
                            to={`/${item}`}
                            data-taborder=""
                            className={navLinkClass}
                            activeClassName="a-nav__item-link--active"
                          >
                            {item}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </nav>
        </div>
      </header>
    );
  }
}

Header.propTypes = {
  links: PropTypes.arrayOf(PropTypes.string).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string
  }).isRequired,
  appState: PropTypes.shape({
    menuState: PropTypes.string.isRequired,
    adminMenuState: PropTypes.string,
    loggedIn: PropTypes.bool,
    authToken: PropTypes.string,
    windowSize: PropTypes.shape({
      width: PropTypes.number
    }).isRequired
  }).isRequired,
  actions: PropTypes.shape({
    setMenuState: PropTypes.func,
    setAdminMenuState: PropTypes.func,
    logout: PropTypes.func
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func
  }),
  profile: PropTypes.shape({
    user: PropTypes.shape({
      profile: PropTypes.shape({
        _id: PropTypes.string,
        avatarUrl: PropTypes.string,
        username: PropTypes.string
      }).isRequired,
      verified: PropTypes.bool
    }).isRequired
  })
};

const mapStateToProps = state => ({
  appState: state.appState,
  profile: state.profile
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch)
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
