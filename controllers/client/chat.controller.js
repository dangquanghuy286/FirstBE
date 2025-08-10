const { uploadToCloudinary } = require("../../helpers/uploadToCloudinary");
const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");

// [GET]/chat
module.exports.index = async (req, res) => {
  const userId = res.locals.user.id;
  const userName = res.locals.user.userName;
  const avatar = res.locals.user.avatar;

  // Socket Io
  _io.once("connection", (socket) => {
    socket.on("CLIENT_SEND_MESSAGE", async (data) => {
      let images = [];
      for (const linkAnh of data.images) {
        const link = await uploadToCloudinary(linkAnh);
        images.push(link);
      }
      console.log(images);

      // Lưu vào DB
      const chat = new Chat({
        user_Id: userId,
        content: data.content,
        images: images,
      });

      await chat.save();

      // Trả dữ liệu về client, bao gồm avatar

      _io.emit("SERVER_SEND_MESSAGE", {
        userId: userId,
        userName: userName,
        content: data.content,
        avatar: avatar,
        images: images,
      });
    });
    // Typing
    socket.on("CLIENT_TYPING", (type) => {
      // Hiển thị trạng thái đang gõ
      socket.broadcast.emit("SERVER_TYPING", {
        userId: userId,
        userName: userName,
        type: type,
      });
    });
  });

  // Lấy info của người đang đăng nhập
  const infoUser = await User.findById(userId).select("userName avatar");

  // Lấy id user khác (khách) trong danh sách chat
  let otherUser = null;

  // Lấy danh sách tin nhắn
  const chats = await Chat.find({ deleted: false });

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
