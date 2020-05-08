const mongoose = require("mongoose");
var noteSchema = new mongoose.Schema({
  title: String,
  tasks: [
    {
      text: String,
      done: {
        type: String,
        default: false
      }
    }
  ]
});
module.exports = mongoose.model("note", noteSchema);
