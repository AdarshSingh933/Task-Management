const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const registerController = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    console.log(req.body);

    // Check if the user already exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user with role
    user = new User({ name, email, password: hashedPassword, role: role || "User" });

    await user.save();

    res.status(201).json({ message: "User registered successfully", user });

  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Server error" });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET,
       { expiresIn: "1h" }
      );

    res.json({ token });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}
const logoutController = (req, res) => {
    res.status(200).json({ message: "User logged out successfully" });
  };

  module.exports = { registerController, loginController, logoutController };  