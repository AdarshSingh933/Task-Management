const User = require("../models/User");

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const getNotifications = async (req, res) => {
    try {
      const notifications = await Notification.find({ user: req.user.id, seen: false }).sort({ date: -1 });
  
      res.status(200).json({ notifications });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };
  
  const markAsRead = async (req, res) => {
    try {
      await Notification.updateMany({ user: req.user.id, seen: false }, { seen: true });
  
      res.status(200).json({ message: "Notifications marked as read" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };

  module.exports = { getUserProfile,getNotifications,markAsRead };
  