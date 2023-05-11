const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

router.post("/", async (req, res) => {
  const { conversationId, message, time } = req.body;
  const newConversation = new User({ conversationId, message, time });
  await newConversation.save();
  res.status(201).send({ message: "message inserted successfully" });
});

module.exports = router;
