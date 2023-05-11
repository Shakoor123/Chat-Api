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

// Route to follow a user
router.post("/users/:id/follow", async (req, res) => {
  const userId = req.params.id;
  const followerId = req.body.followerId;

  try {
    // Update the follower's followings list
    await User.findByIdAndUpdate(
      followerId,
      { $push: { followings: userId } },
      { new: true }
    );

    // Update the user's followers list
    const user = await User.findByIdAndUpdate(
      userId,
      { $push: { followers: followerId } },
      { new: true }
    );

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
