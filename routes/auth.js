const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

// Register a new user
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    res.status(201).send({ message: "User registered successfully" });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Authenticate a user and generate JWT token
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid email or password");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }
    res.send({ user });
  } catch (error) {
    res.status(401).send({ error: error.message });
  }
});

module.exports = router;
