const mongoose = require("mongoose");

const roomChatSchema = new mongoose.Schema(
  {
    title: String,
    avatar: String,
    typeRoom: String,
    status: String,
    theme: String,
    users: [{ user_Id: String, role: String }],

    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: { type: Date },
  },
  { timestamps: true }
);

const RoomChat = mongoose.model("RoomChat", roomChatSchema, "rooms-chat");

module.exports = RoomChat;
