import React from "react";
import classes from "./NavBar.module.css";
import M from "materialize-css";

class NavBar extends React.Component {
  componentDidMount() {
    // Auto initialize all the things!
    M.AutoInit();
  }
  render() {
    let username = this.props.username;
    if (username)
      username = username.charAt(0).toUpperCase() + username.slice(1);
    let content = username ? (
      <React.Fragment>
        <li>
          <h5>Hi, {username}</h5>
        </li>
        <li>
          <a href="#" onClick={this.props.logout}>
            <h5>Logout</h5>
          </a>
        </li>{" "}
      </React.Fragment>
    ) : null;
    let sidenav_content = username ? (
      <React.Fragment>
        <li>
          <h5 className={classes.red}>Hi, {username}</h5>
        </li>
        <li>
          <a href="#" onClick={this.props.logout}>
            <h5>Logout</h5>
          </a>
        </li>{" "}
      </React.Fragment>
    ) : null;
    return (
      <React.Fragment>
        <nav>
          <div class="nav-wrapper">
            <a href="#" class={classes.logo + " brand-logo"}>
              Google Keep Clone
            </a>
            <a href="#" data-target="mobile-demo" class="sidenav-trigger">
              <i class="material-icons">menu</i>
            </a>
            <ul class="right hide-on-med-and-down">{content}</ul>
          </div>
        </nav>

        <ul class="sidenav" id="mobile-demo">
          {sidenav_content}
        </ul>
      </React.Fragment>
    );
  }
}

export default NavBar;
