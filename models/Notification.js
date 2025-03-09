const notificationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    task: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
    message: String,
    date: { type: Date, default: Date.now },
    seen: { type: Boolean, default: false },
  });
  
  const Notification = mongoose.model("Notification", notificationSchema);
  module.exports = Notification;
  