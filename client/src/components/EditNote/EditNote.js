import React from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import classes from "./EditNote.module.css";
import axios from "axios";
import Alert from "@material-ui/lab/Alert";

class EditNote extends React.Component {
  state = {
    newTitle: undefined,
    newTasks: undefined,
    error: undefined
  };
  componentDidMount() {
    console.log(this.props.data);
    let title = this.props.data.title;
    let tasks = [];
    if (this.props.data.tasks) tasks = [...this.props.data.tasks];
    this.setState({ newTitle: title, newTasks: tasks });
  }
  newTitleHandler = value => {
    this.setState({ newTitle: value });
  };
  newTaskHandler = event => {
    let value = event.target.value;
    if (event.key !== "Enter") return;
    let tasks = this.state.newTasks;
    if (!tasks) tasks = [];
    tasks.push({ text: value, done: false });
    this.setState({ newTasks: tasks });
  };
  newTaskChangeHandler = idx => {
    let newTasks = [...this.state.newTasks];
    if (!newTasks || !newTasks[idx]) return;
    newTasks[idx].done = newTasks[idx].done === "true" ? "false" : "true";
    this.setState({ newTasks: newTasks });
  };
  handleCreate = () => {
    let newTasks = this.state.newTasks;
    let newTitle = this.state.newTitle;
    let token = sessionStorage.getItem("x-access-token");

    if (!this.props.loggedIn || !token) return;
    if (!newTitle) {
      this.setState({ error: "Please Enter Title" });
      return;
    }
    if (!newTasks) newTasks = [];
    let newNote = {
      title: newTitle,
      tasks: [...newTasks]
    };
    console.log(newNote);
    axios
      .post(`/api/notes/${this.props.data._id}`, {
        headers: { "x-access-token": token },
        data: newNote
      })
      .then(res => {
        console.log(res);
        this.props.discard();
        let data = res.data.notes;
        this.props.edit(data);
      })
      .catch(err => {
        console.log(err);
        // sessionStorage.clear();
        // console.dir(err);
        // let error = "Something Went Wrong!!";
        // if (err.response && err.response.data && err.response.data.message)
        //   error = err.response.data.message;
        // this.setState({ error: error });
      });
  };
  render() {
    let newTasks = this.state.newTasks;
    const newTasksContent = newTasks
      ? newTasks.map((task, idx) => {
          return (
            <Grid item key={idx}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={task.done == "true"}
                    onChange={this.newTaskChangeHandler.bind(this, idx)}
                  />
                }
              />
              <span class="MuiFormControlLabel-label">
                {task.done == "true" ? (
                  <strike style={{ color: "#ccc" }}>{task.text}</strike>
                ) : (
                  task.text
                )}
              </span>
            </Grid>
          );
        })
      : null;
    return (
      <Grid container className={classes.data_grid} justify="center">
        <Paper elevation={3} className={"hoverable"}>
          <div className={classes.data_card}>
            <h3>Edit Note</h3>
            {this.state.error ? (
              <Alert severity="error">{this.state.error}</Alert>
            ) : null}
            <input
              type="text"
              placeholder="Enter Title"
              id="editNoteTitle"
              value={this.state.newTitle}
              onChange={event => this.newTitleHandler(event.target.value)}
              required
            />
            <input
              style={{ margin: "10px auto" }}
              type="text"
              id="editNoteTask"
              placeholder="Enter Task"
              onKeyPress={event => this.newTaskHandler(event)}
            />
            <Grid container>
              <Grid xs={12} spacing={2} column className={classes.show}>
                {newTasksContent}
              </Grid>
            </Grid>
            <Grid container justify="space-between">
              <Button
                style={{ margin: "5px" }}
                variant="contained"
                color="secondary"
                onClick={this.props.discard}
              >
                Cancel
              </Button>
              <Button
                style={{ margin: "5px" }}
                variant="contained"
                onClick={this.props.delete}
              >
                Delete
              </Button>
              <Button
                style={{ margin: "5px" }}
                variant="contained"
                color="primary"
                onClick={this.handleCreate}
              >
                Edit
              </Button>
            </Grid>
          </div>
        </Paper>
      </Grid>
    );
  }
}

export default EditNote;
