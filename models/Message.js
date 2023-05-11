const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation",
  },
  message: {
    type: "string",
  },
  time: {
    type: Date,
  },
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
