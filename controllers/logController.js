const express = require("express");
const Log = require("../models/Log");

const logController = async (req, res) => {
    try {
      const logs = await Log.find().populate("userId", "name email").populate("taskId", "title");
      res.status(200).json(logs);
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  }

module.exports = {logController}