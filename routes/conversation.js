const express = require("express");
const router = express.Router();
const Conversation = require("../models/Conversation");

// Create new conversation
router.post("/", async (req, res) => {
  const { senderId, receiverId } = req.body;

  try {
    let conversation = await Conversation.findOne({ senderId, receiverId });

    if (conversation) {
      conversation.messages.push({
        sender: senderId,
        receiver: receiverId,
      });
      conversation = await conversation.save();
    } else {
      conversation = new Conversation({
        senderId,
        receiverId,
      });
      conversation = await conversation.save();
    }

    res.json({ success: true, conversation });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({
        success: false,
        message: "Internal server error on conversation",
      });
  }
});

// Get conversation by sender and receiver ID
router.get("/:senderId/:receiverId", async (req, res) => {
  const { senderId, receiverId } = req.params;

  try {
    const conversation = await Conversation.findOne({ senderId, receiverId });

    if (conversation) {
      res.json({ success: true, conversation });
    } else {
      res
        .status(404)
        .json({ success: false, message: "Conversation not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Delete conversation by sender and receiver ID
router.delete("/:senderId/:receiverId", async (req, res) => {
  const { senderId, receiverId } = req.params;

  try {
    const conversation = await Conversation.findOneAndDelete({
      senderId,
      receiverId,
    });

    if (conversation) {
      res.json({ success: true });
    } else {
      res
        .status(404)
        .json({ success: false, message: "Conversation not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
