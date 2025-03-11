const express = require("express");
const { logController } = require("../controllers/logController");
const { authenticateToken, authorizeRoles } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", authenticateToken, authorizeRoles("Admin"), logController);

module.exports = router;