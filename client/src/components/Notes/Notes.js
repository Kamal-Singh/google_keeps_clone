import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import classes from "./Notes.module.css";

class Notes extends Component {
  render() {
    let tasks = this.props.tasks;
    const tasksContent = tasks
      ? tasks.slice(0, 5).map((task, idx) => {
          return (
            <Grid item key={idx}>
              <FormControlLabel
                control={<Checkbox checked={task.done === "true"} disabled />}
              />
              <span class="MuiFormControlLabel-label">
                {task.done === "true" ? (
                  <strike
                    style={{
                      fontSize: "1.4em",
                      color: "#ccc",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis"
                    }}
                  >
                    {task.text}
                  </strike>
                ) : (
                  task.text
                )}
              </span>
            </Grid>
          );
        })
      : null;
    return (
      <Grid item>
        <Paper elevation={2} className={"hoverable"}>
          <div className={classes.card} onClick={this.props.clicked}>
            <h4>{this.props.title}</h4>
            <Grid container className={classes.blur} direction="column">
              {tasksContent}
            </Grid>
          </div>
        </Paper>
      </Grid>
    );
  }
}

export default Notes;
