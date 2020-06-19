import React, { Component } from "react";
import NavBar from "../../components/UI/NavBar/NavBar";
import Login from "../../components/Login/Login";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import classes from "./Layout.module.css";
import NewNote from "../../components/NewNote/NewNote";
import axios from "axios";
import Notes from "../../components/Notes/Notes";
import Backdrop from "@material-ui/core/Backdrop";
import EditNote from "../../components/EditNote/EditNote";

class Layout extends Component {
  state = {
    isLoggedIn: false,
    data: undefined,
    username: undefined,
    showBackdrop: false,
    editKey: undefined
  };

  componentDidMount() {
    let username = sessionStorage.getItem("username");
    let data = JSON.parse(sessionStorage.getItem("data"));
    if (!data) {
      this.handleLogout();
      return;
    }
    if (username && sessionStorage.getItem("x-access-token"))
      this.setState({ username: username, data: data, isLoggedIn: true });
  }

  setData = data => {
    let username = sessionStorage.getItem("username");
    sessionStorage.setItem("data", JSON.stringify(data));
    let isLoggedIn = false;
    if (username && sessionStorage.getItem("x-access-token")) isLoggedIn = true;
    this.setState({ data: data, isLoggedIn: isLoggedIn, username: username });
  };

  handleLogout = () => {
    sessionStorage.clear();
    this.setState({ isLoggedIn: false, data: undefined, username: undefined });
  };

  handleNewNoteCreate = data => {
    sessionStorage.setItem("data", JSON.stringify(data));
    this.setState({ data: data });
  };
  handleEditClick = key => {
    this.setState({ showBackdrop: true, editKey: key });
  };

  handleDiscardEditNote = () => {
    this.setState({ showBackdrop: false, editKey: undefined });
  };

  handleDelete = key => {
    let id = this.state.data[key]["_id"];
    if (!id) return;
    let token = sessionStorage.getItem("x-access-token");
    if (!token) return;
    axios
      .get(`/api/notes/${id}`, {
        headers: { "x-access-token": token }
      })
      .then(res => {
        console.log(res);
        this.handleDiscardEditNote();
        let data = res.data.notes;
        this.handleNewNoteCreate(data);
      })
      .catch(err => {
        console.log(err);
      });
  };
  render() {
    const authContent = !this.state.isLoggedIn ? (
      <Grid container>
        <Grid item xs={12}>
          <Grid container justify="center" spacing={2}>
            <Login type="login" setData={this.setData} />
            <Login type="register" setData={this.setData} />
          </Grid>
        </Grid>
      </Grid>
    ) : null;
    let data = { ...this.state.data };
    const notes = this.state.data
      ? Object.getOwnPropertyNames(data).map(key => {
          let note = data[key];
          return (
            <Notes
              title={note.title}
              tasks={note.tasks}
              key={note._id}
              clicked={this.handleEditClick.bind(this, key)}
            />
          );
        })
      : null;
    return (
      <React.Fragment>
        <NavBar username={this.state.username} logout={this.handleLogout} />
        {authContent}
        {this.state.isLoggedIn ? (
          <React.Fragment>
            <Backdrop
              className={classes.backdrop}
              open={this.state.showBackdrop}
              style={{ zIndex: "9999" }}
            >
              {this.state.editKey ? (
                <EditNote
                  discard={this.handleDiscardEditNote}
                  data={this.state.data[this.state.editKey]}
                  loggedIn={this.state.isLoggedIn}
                  edit={this.handleNewNoteCreate}
                  delete={this.handleDelete.bind(this, this.state.editKey)}
                />
              ) : null}
            </Backdrop>
            <NewNote
              loggedIn={this.state.isLoggedIn}
              create={this.handleNewNoteCreate}
            />
            <Grid container className={classes.notes}>
              <Grid item xs={12}>
                <Grid container justify="space-around" spacing={2}>
                  {notes}
                </Grid>
              </Grid>
            </Grid>
          </React.Fragment>
        ) : null}
      </React.Fragment>
    );
  }
}

export default Layout;
