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
    // Chức năng từ chối kết bạn
    socket.on("CLIENT_DELETED_FRIEND", async (userId) => {
      //id của A
      const myUserId = res.locals.user.id; //Id của B

      //   Xóa id của A vào acceptFriends của B
      const exitIdAinB = await User.findOne({
        _id: myUserId,
        acceptFriends: userId,
      });
      if (exitIdAinB) {
        await User.updateOne(
          {
            _id: myUserId,
          },
          {
            $pull: { acceptFriends: userId },
          }
        );
      }
      // Xóa id của B đã có chưa
      const exitBinA = await User.findOne({
        _id: userId,
        requestFriends: myUserId,
      });
      if (exitBinA) {
        await User.updateOne(
          {
            _id: userId,
          },
          {
            $pull: { requestFriends: myUserId },
          }
        );
      }
    });
    // Chức năng chấp nhận kết bạn
    socket.on("CLIENT_ACCEPT_FRIEND", async (userId) => {
      //id của A
      const myUserId = res.locals.user.id; //Id của B
      // Thêm userId a vào friendList b

      //   Xóa id của A vào acceptFriends của B
      const exitIdAinB = await User.findOne({
        _id: myUserId,
        acceptFriends: userId,
      });
      if (exitIdAinB) {
        await User.updateOne(
          {
            _id: myUserId,
          },
          {
            $push: {
              listFriends: {
                user_Id: userId,
                room_chat_Id: "",
              },
            },
            $pull: { acceptFriends: userId },
          }
        );
      }
      // Xóa id của B đã có chưa
      const exitBinA = await User.findOne({
        _id: userId,
        requestFriends: myUserId,
      });
      if (exitBinA) {
        await User.updateOne(
          {
            _id: userId,
          },
          {
            $push: {
              listFriends: {
                user_Id: myUserId,
                room_chat_Id: "",
              },
            },
            $pull: { requestFriends: myUserId },
          }
        );
      }
    });
  });
};
