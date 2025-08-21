const User = require("../../models/user.model");

// Xuất một hàm middleware nhận đối tượng response (res)
module.exports = (res) => {
  // Lắng nghe sự kiện kết nối socket
  _io.once("connection", (socket) => {
    // Chức năng gửi yêu cầu kết bạn
    socket.on("CLIENT_ADD_FRIEND", async (userId) => {
      // userId: ID của người nhận yêu cầu kết bạn (B)
      const myUserId = res.locals.user.id; // ID của người gửi yêu cầu kết bạn (A)

      // Kiểm tra xem A đã có trong danh sách acceptFriends của B chưa
      const exitIdAinB = await User.findOne({
        _id: userId,
        acceptFriends: myUserId,
      });
      // Nếu chưa có, thêm ID của A vào acceptFriends của B
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

      // Kiểm tra xem B đã có trong danh sách requestFriends của A chưa
      const exitBinA = await User.findOne({
        _id: myUserId,
        requestFriends: userId,
      });
      // Nếu chưa có, thêm ID của B vào requestFriends của A
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
      //Lấy ra độ dài acceptFriend của B và trả về B
      const infoUserB = await User.findOne({
        _id: userId,
      });
      const lengthFriend = infoUserB.acceptFriends.length;
      socket.broadcast.emit("SERVER_LENGTH_ACCEPT_FRIEND", {
        userId: userId,
        lengthFriend: lengthFriend,
      });
    });

    // Chức năng hủy yêu cầu kết bạn
    socket.on("CLIENT_CANCEL_FRIEND", async (userId) => {
      // userId: ID của người nhận yêu cầu kết bạn (B)
      const myUserId = res.locals.user.id; // ID của người gửi yêu cầu kết bạn (A)

      // Kiểm tra xem A có trong danh sách acceptFriends của B không
      const exitIdAinB = await User.findOne({
        _id: userId,
        acceptFriends: myUserId,
      });
      // Nếu có, xóa ID của A khỏi acceptFriends của B
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

      // Kiểm tra xem B có trong danh sách requestFriends của A không
      const exitBinA = await User.findOne({
        _id: myUserId,
        requestFriends: userId,
      });
      // Nếu có, xóa ID của B khỏi requestFriends của A
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

    // Chức năng từ chối yêu cầu kết bạn
    socket.on("CLIENT_DELETED_FRIEND", async (userId) => {
      // userId: ID của người gửi yêu cầu kết bạn (A)
      const myUserId = res.locals.user.id; // ID của người nhận yêu cầu kết bạn (B)

      // Kiểm tra xem A có trong danh sách acceptFriends của B không
      const exitIdAinB = await User.findOne({
        _id: myUserId,
        acceptFriends: userId,
      });
      // Nếu có, xóa ID của A khỏi acceptFriends của B
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

      // Kiểm tra xem B có trong danh sách requestFriends của A không
      const exitBinA = await User.findOne({
        _id: userId,
        requestFriends: myUserId,
      });
      // Nếu có, xóa ID của B khỏi requestFriends của A
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

    // Chức năng chấp nhận yêu cầu kết bạn
    socket.on("CLIENT_ACCEPT_FRIEND", async (userId) => {
      // userId: ID của người gửi yêu cầu kết bạn (A)
      const myUserId = res.locals.user.id; // ID của người nhận yêu cầu kết bạn (B)

      // Kiểm tra xem A có trong danh sách acceptFriends của B không
      const exitIdAinB = await User.findOne({
        _id: myUserId,
        acceptFriends: userId,
      });
      // Nếu có, thêm A vào danh sách bạn bè của B và xóa A khỏi acceptFriends của B
      if (exitIdAinB) {
        await User.updateOne(
          {
            _id: myUserId,
          },
          {
            $push: {
              listFriends: {
                user_Id: userId,
                room_chat_Id: "", // ID phòng chat để trống, sẽ được cập nhật sau
              },
            },
            $pull: { acceptFriends: userId },
          }
        );
      }

      // Kiểm tra xem B có trong danh sách requestFriends của A không
      const exitBinA = await User.findOne({
        _id: userId,
        requestFriends: myUserId,
      });
      // Nếu có, thêm B vào danh sách bạn bè của A và xóa B khỏi requestFriends của A
      if (exitBinA) {
        await User.updateOne(
          {
            _id: userId,
          },
          {
            $push: {
              listFriends: {
                user_Id: myUserId,
                room_chat_Id: "", // ID phòng chat để trống, sẽ được cập nhật sau
              },
            },
            $pull: { requestFriends: myUserId },
          }
        );
      }
    });
  });
};
