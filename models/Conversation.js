const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  messages: [
    {
      message: String,
      sentAt: Date,
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
  ],
});

const Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = Conversation;
