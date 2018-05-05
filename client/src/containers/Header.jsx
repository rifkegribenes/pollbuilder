import React from "react";
import { NavLink, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as Actions from "../store/actions";
import ModalSm from "./ModalSm";

import { skip } from "../utils";
import logo from "../img/pollbuilder.svg";
import gear from "../img/gear.svg";

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
    if (this.props.appState.windowSize.width < 670) {
      if (this.props.appState.menuState === "closed") {
        console.log("setting open");
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
        menu: "form__button form__button--big h-nav__item-menu--open",
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
        menu: "form__button form__button--big h-nav__item-menu",
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
    let avatarUrl;
    if (this.props.profile.user.profile) {
      avatarUrl = this.props.profile.user.profile.avatarUrl;
    }

    if (
      !avatarUrl ||
      avatarUrl ===
        "https://raw.githubusercontent.com/rifkegribenes/pollbuilder/master/client/public/img/pollbuilder_icon.png"
    ) {
      avatarUrl = gear;
    }
    const backgroundStyle = {
      backgroundImage: `url(${avatarUrl})`,
      backgroundSize: "cover",
      backgroundPosition: "center center"
    };
    let adminLinks = ["my account", "my polls", "logout"];

    const linkmap = {
      "my account": "profile",
      "my polls": "userpolls",
      logout: "logout",
      login: "login",
      about: "about"
    };

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
      <div>
        <ModalSm
          modalClass={this.props.appState.modal.class}
          modalText="You must log in to create a new poll."
          modalType={this.props.appState.modal.type}
          modalTitle="Login required"
          buttonText={this.props.appState.modal.buttonText || "Continue"}
          dismiss={() => {
            this.props.actions.dismissModal();
          }}
          redirect={this.props.appState.modal.redirect}
          action={() => {
            if (this.props.appState.modal.action) {
              this.props.appState.modal.action();
            } else {
              this.props.actions.dismissModal();
              if (this.props.appState.modal.type === "modal__error") {
                this.props.history.push("/login");
              }
            }
          }}
        />
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
                <button className="h-nav__icon">
                  <span className="sr-only">Toggle navigation</span>
                  <div
                    className={classObj[this.props.appState.menuState].bar1}
                  />
                  <div
                    className={classObj[this.props.appState.menuState].bar2}
                  />
                  <div
                    className={classObj[this.props.appState.menuState].bar3}
                  />
                </button>
                <span
                  className={classObj[this.props.appState.menuState].menuspan}
                >
                  Menu
                </span>
              </span>
            </div>
            <div className="h-nav__item h-nav__item--home">
              <NavLink
                to="/"
                className="h-nav__logo-wrap"
                activeClassName="h-nav__logo-wrap--active"
              >
                <img src={logo} className="h-nav__logo" alt="pollbuilder" />
              </NavLink>
            </div>

            <nav className={classObj[this.props.appState.menuState].nav}>
              <ul className={classObj[this.props.appState.menuState].ul}>
                <li className="h-nav__item">
                  <NavLink
                    to="/polls"
                    className="h-nav__item-link"
                    activeClassName="h-nav__item-link h-nav__item-link--active"
                  >
                    Vote
                  </NavLink>
                </li>
                <li className="h-nav__item">
                  <a
                    className={
                      this.props.match.path === "/createpoll"
                        ? "h-nav__item-link h-nav__item-link--active"
                        : "h-nav__item-link"
                    }
                    onClick={() => {
                      console.log("click");
                      if (!this.props.appState.loggedIn) {
                        this.props.actions.setModalErrorH(
                          "You must log in to create a poll"
                        );
                      } else {
                        this.props.history.push("/createpoll");
                      }
                    }}
                  >
                    New Poll
                  </a>
                </li>
              </ul>
            </nav>
            {this.props.appState.loggedIn ? (
              <nav className="a-nav__outer-wrap">
                <button
                  className={
                    avatarUrl === gear
                      ? "h-nav__avatar aria-button h-nav__gear"
                      : "h-nav__avatar aria-button"
                  }
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
                            to={`/${linkmap[item]}`}
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
              </nav>
            ) : (
              this.props.location.pathname !== "/login" && (
                <NavLink
                  to="/login"
                  className="form__button form__button--big h-nav__item-link--login"
                  activeClassName="h-nav__item-link--active"
                >
                  Login
                </NavLink>
              )
            )}
          </div>
        </header>
      </div>
    );
  }
}

Header.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string
  }).isRequired,
  match: PropTypes.shape({
    path: PropTypes.string
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
    setModalError: PropTypes.func,
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
