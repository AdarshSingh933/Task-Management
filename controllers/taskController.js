const Task = require("../models/Task");
const Notification = require("../models/Notification");
const {logAction} = require("../middlewares/logger");
const redis = require("../utils/redisClient");

const getTasks = async (req, res) => {
  try {
    // Check cache first
    const cachedTasks = await redis.get("tasks");
    if (cachedTasks) {
      console.log("Serving from Cache");
      return res.status(200).json(JSON.parse(cachedTasks));
    }
    console.log("Cache Miss - Fetching from DB");
    const tasks = await Task.find();

    // Store result in Redis cache for 5 minutes
    await redis.set("tasks", JSON.stringify(tasks), "EX", 300);
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

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

    await logAction(req.user.id, newTask._id, "Created", `Task '${title}' created.`);
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

    await logAction(req.user.id, id, "Updated", `Task '${task.title}' updated.`);

    await redis.del("tasks");

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
     // Log Task Deletion
     await logAction(req.user.id, id, "Deleted", `Task '${task.title}' deleted.`);

    await task.deleteOne();
    await redis.del("tasks");
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createTask, updateTask, deleteTask };
