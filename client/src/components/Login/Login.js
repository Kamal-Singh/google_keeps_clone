import React from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import classes from "./Login.module.css";
import axios from "axios";

class Login extends React.Component {
  state = {
    error: undefined,
    form: {},
    disabled: true
  };
  handleFormChange = (value, type) => {
    let form = { ...this.state.form };
    form[type] = value;
    let disabled = true;
    if (form && form["username"] && form["password"]) disabled = false;
    this.setState({ form: form, disabled: disabled });
  };
  handleOnClick = submit_url => {
    let form = { ...this.state.form };
    if (!form || !form["username"] || !form["password"]) return;
    axios
      .post(submit_url, {
        ...form
      })
      .then(res => {
        console.log(res);
        sessionStorage.setItem("x-access-token", res.data.token);
        sessionStorage.setItem("username", res.data.username);
        this.props.setData(res.data.notes);
      })
      .catch(err => {
        sessionStorage.clear();
        console.dir(err);
        let error = "Something Went Wrong!!";
        if (err.response && err.response.data && err.response.data.message)
          error = err.response.data.message;
        this.setState({ error: error });
      });
  };
  render() {
    let title = this.props.type;
    title = title.charAt(0).toUpperCase() + title.slice(1);
    let submit_url = "/api/auth/signin";
    if (this.props.type === "register") submit_url = "/api/auth/signup";
    return (
      <Grid item>
        <Paper elevation={3} className="hoverable">
          <div className={classes.card}>
            <h3>{title}</h3>
            {this.state.error ? (
              <p className={"flow-text center-align"} style={{ color: "red" }}>
                {this.state.error}
              </p>
            ) : null}
            <input
              className="validate"
              style={{ margin: "10px auto" }}
              placeholder="Username"
              type="text"
              onChange={event =>
                this.handleFormChange(event.target.value, "username")}
              required
            />
            <input
              className="validate"
              style={{ margin: "10px auto" }}
              placeholder="Password"
              type="password"
              onChange={event =>
                this.handleFormChange(event.target.value, "password")}
              required
            />
            <a
              style={{ margin: "30px auto 50px auto", display: "block" }}
              className={
                (this.state.disabled ? "disabled " : "") +
                "waves-effect waves-light btn-large"
              }
              onClick={() => this.handleOnClick(submit_url)}
            >
              {title}
            </a>
          </div>
        </Paper>
      </Grid>
    );
  }
}

export default Login;
