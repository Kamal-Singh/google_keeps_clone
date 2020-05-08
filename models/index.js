const mongoose = require("mongoose");
mongoose.set("debug", true);
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/google_keeps_clone");
module.exports.User = require("./auth");
module.exports.Note = require("./note");
