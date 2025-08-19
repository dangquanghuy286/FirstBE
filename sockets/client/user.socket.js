const User = require("../../models/user.model");

module.exports = (res) => {
  _io.once("connection", (socket) => {
    // Chức năng gửi yêu cầu
    socket.on("CLIENT_ADD_FRIEND", async (userId) => {
      //id của b
      const myUserId = res.locals.user.id; //Id của a

      //   Thêm id của A vào acceptFriends của B
      const exitIdAinB = await User.findOne({
        _id: userId,
        acceptFriends: myUserId,
      });
      if (!exitIdAinB) {
        await User.updateOne(
          {
            _id: userId,
          },
          {
            $push: { acceptFriends: myUserId },
          }
        );
      }
      // Kiểm tra id của B đã có chưa
      const exitBinA = await User.findOne({
        _id: myUserId,
        requestFriends: userId,
      });
      if (!exitBinA) {
        await User.updateOne(
          {
            _id: myUserId,
          },
          {
            $push: { requestFriends: userId },
          }
        );
      }
    });
    // Chức năng hủy yêu cầu
    socket.on("CLIENT_CANCEL_FRIEND", async (userId) => {
      //id của b
      const myUserId = res.locals.user.id; //Id của a

      //   Xóa id của A vào acceptFriends của B
      const exitIdAinB = await User.findOne({
        _id: userId,
        acceptFriends: myUserId,
      });
      if (exitIdAinB) {
        await User.updateOne(
          {
            _id: userId,
          },
          {
            $pull: { acceptFriends: myUserId },
          }
        );
      }
      // Xóa id của B đã có chưa
      const exitBinA = await User.findOne({
        _id: myUserId,
        requestFriends: userId,
      });
      if (exitBinA) {
        await User.updateOne(
          {
            _id: myUserId,
          },
          {
            $pull: { requestFriends: userId },
          }
        );
      }
    });
  });
};
