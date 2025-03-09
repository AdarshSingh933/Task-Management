const express = require("express");
const { getUserProfile,getNotifications,markAsRead } = require("../controllers/userController");
const { authenticateToken, authorizeRoles } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/profile", authenticateToken,authorizeRoles("User", "Admin"), getUserProfile);
router.get("/notifications", authenticateToken, getNotifications);
router.put("/notifications/read", authenticateToken, markAsRead);

module.exports = router;
