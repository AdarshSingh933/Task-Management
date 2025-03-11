const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  action: { type: String, required: true }, // Created, Updated, Deleted
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  timestamp: { type: Date, default: Date.now },
  details: { type: String }, // Extra info about changes
});

module.exports = mongoose.model("Log", logSchema);
