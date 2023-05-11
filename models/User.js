const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  followers: [{ type: mongoose.Schema.Types.ObjectId }],
  followings: [{ type: mongoose.Schema.Types.ObjectId }],
});

module.exports = mongoose.model("User", userSchema);
