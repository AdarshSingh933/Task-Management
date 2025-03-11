const Log = require("../models/Log");

const logAction = async (userId, taskId, action, details = "") => {
  try {
    const log = new Log({ userId, taskId, action, details });
    await log.save();
  } catch (error) {
    console.error("Logging Error:", error);
  }
};

module.exports = logAction;
