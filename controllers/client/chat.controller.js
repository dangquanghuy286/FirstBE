const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");
const socketIo = require("../../sockets/client/socket");
// [GET]/chat/roomChatId
module.exports.index = async (req, res) => {
  const userId = res.locals.user.id;
  const roomChatId = req.params.roomChatId;

  // Socket Io
  socketIo(req, res);
  // Lấy info của người đang đăng nhập
  const infoUser = await User.findById(userId).select("userName avatar");

  // Lấy id user khác (khách) trong danh sách chat
  let otherUser = null;

  // Lấy danh sách tin nhắn
  const chats = await Chat.find({ roomChat_Id: roomChatId, deleted: false });

  for (const chat of chats) {
    const user = await User.findById(chat.user_Id).select("userName avatar");
    if (user) {
      chat.infoUser = user;
    }
    if (chat.user_Id.toString() !== userId.toString()) {
      otherUser = chat.infoUser;
    }
  }

  res.render("client/pages/chat/index", {
    title: "Chat",
    chats,
    infoUser,
    otherUser,
  });
};
