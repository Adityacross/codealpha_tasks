
const mongoose = require("mongoose");

const boardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true 
  },
  columnId: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['team', 'personal'],
    required: true
  },
  tasks: {
    type: Array,
    default: []
  }
});

module.exports = mongoose.model("Board", boardSchema);
