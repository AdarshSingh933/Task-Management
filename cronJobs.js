const cron = require("node-cron");
const Task = require("../models/Task");
const Notification = require("../models/Notification");

cron.schedule("0 9 * * *", async () => {
  try {
    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const tasks = await Task.find({
      dueDate: { $gte: now, $lte: tomorrow },
    });

    tasks.forEach(async (task) => {
      await Notification.create({
        user: task.assignedTo,
        task: task._id,
        message: `Reminder: The task "${task.title}" is due soon.`,
      });
    });

    console.log("Reminder notifications sent.");
  } catch (error) {
    console.error("Error sending reminders:", error);
  }
});

module.exports = cron;
