const mongoose = require("mongoose"),
  db = require("../models"),
  jwt = require("jsonwebtoken"),
  config = require("../config");
const JWT_SECRET = process.env.JWT_SECRET || config.JWT_SECRET;

exports.authenticate = function(req, res, next) {
  let token;
  if (req.body && req.body.headers && req.body.headers["x-access-token"])
    token = req.body.headers["x-access-token"];
  else token = req.headers["x-access-token"];
  console.log("Token => ", token);
  if (!token) {
    return res.status(403).send({
      auth: false,
      message: "Unauthorized Acesss!!"
    });
  }
  jwt.verify(token, JWT_SECRET, function(err, decoded) {
    if (err) {
      return res.status(500).send({
        auth: false,
        message: "Invalid or corrupted authentication token!!"
      });
    }
    req.userId = decoded.userId;
    next();
  });
};

module.exports = exports;
