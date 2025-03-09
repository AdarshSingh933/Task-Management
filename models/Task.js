const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending" },
  dueDate: { type: Date, required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  notifications: [
    {
      message: String,
      date: { type: Date, default: Date.now },
      seen: { type: Boolean, default: false },
    },
  ],
});

module.exports = mongoose.model("Task", TaskSchema);
