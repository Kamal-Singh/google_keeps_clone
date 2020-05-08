var db = require("../models");
var jwt = require("jsonwebtoken");
const config = require("../config");
const JWT_SECRET = process.env.JWT_SECRET || config.JWT_SECRET;

exports.signup = function(req, res, next) {
  db.User
    .create(req.body)
    .then(function(user) {
      var token = jwt.sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: 86400
      });
      var message = "New User Created!!";
      res.status(200).json({
        userId: user.id,
        username: user.username,
        notes: user.notes,
        message: message,
        token: token
      });
    })
    .catch(function(err) {
      res.status(400).json(err);
    });
};

exports.signin = function(req, res, next) {
  db.User
    .findOne({ username: req.body.username })
    .populate("notes")
    .then(function(user) {
      user.comparePassword(req.body.password, function(err, isMatch) {
        if (isMatch) {
          var token = jwt.sign({ userId: user.id }, JWT_SECRET);
          res.status(200).json({
            userId: user.id,
            username: user.username,
            notes: user.notes,
            token: token
          });
        } else {
          res.status(403).json({
            message: "Wrong Password!!"
          });
        }
      });
    })
    .catch(function(err) {
      res.status(400).json({
        message: "Wrong Username!!"
      });
    });
};

module.exports = exports;
