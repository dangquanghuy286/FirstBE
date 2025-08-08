const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    user_Id: String,
    roomChat_Id: String,
    content: String,
    image: Array,
    deleted: {
      type: Boolean,
      default: false,
    },
    deleteDate: Date,
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.model("Chat", chatSchema, "chat");

module.exports = Chat;
