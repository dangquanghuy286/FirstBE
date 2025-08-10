const { uploadToCloudinary } = require("../../helpers/uploadToCloudinary");
const Chat = require("../../models/chat.model");

module.exports = (res) => {
  const userId = res.locals.user.id;
  const userName = res.locals.user.userName;
  const avatar = res.locals.user.avatar;

  _io.once("connection", (socket) => {
    socket.on("CLIENT_SEND_MESSAGE", async (data) => {
      let images = [];
      for (const linkAnh of data.images) {
        const link = await uploadToCloudinary(linkAnh);
        images.push(link);
      }

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
};
