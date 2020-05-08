const mongoose = require("mongoose"),
  db = require("../models"),
  express = require("express"),
  router = express.Router();

// For creating new note
router.post("/", function(req, res) {
  let body = {
    ...req.body.data
  };
  db.Note
    .create(body, { new: true })
    .then(function(note) {
      console.log(note[0]);
      note = note[0];
      let obj = {};
      db.User
        .findOne({ _id: req.userId })
        .populate("notes")
        .then(function(user) {
          user.notes.push(note);
          user.save();
          obj["userId"] = user._id;
          obj["username"] = user.username;
          obj["notes"] = user.notes;
          res.status(200).json(obj);
        })
        .catch(function(err) {
          res.status(500).json(err);
        });
    })
    .catch(function(err) {
      res.status(500).json(err);
    });
});

// For Deleting a Note
router.get("/:id", function(req, res) {
  let id = req.params.id;
  db.Note
    .findByIdAndRemove(id)
    .then(function(note) {
      db.User
        .findOneAndUpdate(
          { _id: req.userId },
          { $pull: { notes: { _id: id } } }
        )
        .populate("notes")
        .then(function(user) {
          let obj = {};
          obj["userId"] = user._id;
          obj["username"] = user.username;
          obj["notes"] = user.notes;
          res.status(200).json(obj);
        })
        .catch(function(err) {
          if (err) {
            res.status(500).json({
              message: "Some Internal Error Occured!!"
            });
          }
        });
    })
    .catch(function(err) {
      if (err) {
        res.status(500).json({
          message: "Some Internal Error Occured!!"
        });
      }
    });
});

// For updating a Post
router.post("/:id", function(req, res) {
  let id = req.params.id;
  let tasks = req.body.data.tasks;
  db.Note
    .findOneAndUpdate(
      { _id: id },
      { $set: { tasks: tasks } },
      { returnOriginal: false, new: true }
    )
    .then(function(Note) {
      db.User
        .findById(req.userId)
        .populate("notes")
        .then(function(user) {
          let obj = {};
          obj["userId"] = user._id;
          obj["username"] = user.username;
          obj["notes"] = user.notes;
          res.status(200).json(obj);
        })
        .catch(function(err) {
          res.status(500).json({
            message: "Unable to update Note!!"
          });
        });
    })
    .catch(function(err) {
      res.status(500).json({
        message: "Unable to update Note!!"
      });
    });
});
module.exports = router;
