const Task = require("../models/Task");
const Notification = require("../models/Notification");

const createTask = async (req, res) => {
  try {
    const { title, description, status, dueDate, assignedTo } = req.body;

    const task = new Task({
      title,
      description,
      status,
      dueDate,
      assignedTo,
      createdBy: req.user.id
    });

    await task.save();
     // Send notification to the assigned user
     if (assignedTo) {
        await Notification.create({
          user: assignedTo,
          task: task._id,
          message: `A new task "${title}" has been assigned to you.`,
        });
      }
    res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    const { title, description, status, dueDate, assignedTo } = req.body;

    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.createdBy.toString() !== req.user.id && req.user.role !== "Admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;
    task.dueDate = dueDate || task.dueDate;
    task.assignedTo = assignedTo || task.assignedTo;

    await task.save();

      // Notify the assigned user
      await Notification.create({
        user: assignedTo,
        task: task._id,
        message: `The task "${task.title}" has been updated.`,
      });

    res.json({ message: "Task updated successfully", task });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.createdBy.toString() !== req.user.id && req.user.role !== "Admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    await task.deleteOne();
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createTask, updateTask, deleteTask };
