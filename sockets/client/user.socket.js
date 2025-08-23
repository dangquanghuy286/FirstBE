const RoomChat = require("../../models/roomchat.model");
const User = require("../../models/user.model");

module.exports = (res) => {
  _io.once("connection", (socket) => {
    // Chức năng gửi yêu cầu kết bạn
    socket.on("CLIENT_ADD_FRIEND", async (userId) => {
      const myUserId = res.locals.user.id;

      // THÊM: Kiểm tra xem hai người có đã là bạn bè không
      const myUser = await User.findOne({ _id: myUserId });
      const targetUser = await User.findOne({ _id: userId });

      // Kiểm tra xem đã là bạn bè chưa
      const alreadyFriends = myUser.listFriends.some(
        (friend) => friend.user_Id === userId
      );
      const targetAlreadyFriends = targetUser.listFriends.some(
        (friend) => friend.user_Id === myUserId
      );

      if (alreadyFriends || targetAlreadyFriends) {
        // Nếu đã là bạn bè, không làm gì cả
        return;
      }

      // Kiểm tra xem đã gửi yêu cầu chưa
      const alreadyRequested = myUser.requestFriends.includes(userId);
      const alreadyReceived = myUser.acceptFriends.includes(userId);

      if (alreadyRequested || alreadyReceived) {
        // Nếu đã gửi yêu cầu hoặc đã nhận yêu cầu, không làm gì cả
        return;
      }

      // Kiểm tra xem A đã có trong danh sách acceptFriends của B chưa
      const exitIdAinB = await User.findOne({
        _id: userId,
        acceptFriends: myUserId,
      });

      if (!exitIdAinB) {
        await User.updateOne(
          { _id: userId },
          { $push: { acceptFriends: myUserId } }
        );
      }

      // Kiểm tra xem B đã có trong danh sách requestFriends của A chưa
      const exitBinA = await User.findOne({
        _id: myUserId,
        requestFriends: userId,
      });

      if (!exitBinA) {
        await User.updateOne(
          { _id: myUserId },
          { $push: { requestFriends: userId } }
        );
      }

      // Lấy ra độ dài acceptFriend của B và trả về B
      const infoUserB = await User.findOne({ _id: userId });
      const lengthFriend = infoUserB.acceptFriends.length;
      socket.broadcast.emit("SERVER_LENGTH_ACCEPT_FRIEND", {
        userId: userId,
        lengthFriend: lengthFriend,
      });

      // Lấy info của A trả về B
      const infoUserA = await User.findOne({ _id: myUserId }).select(
        "_id avatar userName"
      );
      socket.broadcast.emit("SERVER_RETURN_INFO_ACCEPT_FRIEND", {
        userId: userId,
        infoUserA: infoUserA,
      });
    });

    // Chức năng hủy yêu cầu kết bạn
    socket.on("CLIENT_CANCEL_FRIEND", async (userId) => {
      const myUserId = res.locals.user.id;

      // Kiểm tra xem A có trong danh sách acceptFriends của B không
      const exitIdAinB = await User.findOne({
        _id: userId,
        acceptFriends: myUserId,
      });

      if (exitIdAinB) {
        await User.updateOne(
          { _id: userId },
          { $pull: { acceptFriends: myUserId } }
        );
      }

      // Kiểm tra xem B có trong danh sách requestFriends của A không
      const exitBinA = await User.findOne({
        _id: myUserId,
        requestFriends: userId,
      });

      if (exitBinA) {
        await User.updateOne(
          { _id: myUserId },
          { $pull: { requestFriends: userId } }
        );
      }

      // Lấy ra độ dài acceptFriend của B và trả về B
      const infoUserB = await User.findOne({ _id: userId });
      const lengthFriend = infoUserB.acceptFriends.length;
      socket.broadcast.emit("SERVER_LENGTH_ACCEPT_FRIEND", {
        userId: userId,
        lengthFriend: lengthFriend,
      });

      // Lấy id của A trả về cho B
      socket.broadcast.emit("SERVER_RETURN_USERID_CANCEL_FRIEND", {
        userIdB: userId,
        userIdA: myUserId,
      });
    });

    // Chức năng từ chối yêu cầu kết bạn
    socket.on("CLIENT_DELETED_FRIEND", async (userId) => {
      const myUserId = res.locals.user.id;

      // Kiểm tra xem A có trong danh sách acceptFriends của B không
      const exitIdAinB = await User.findOne({
        _id: myUserId,
        acceptFriends: userId,
      });

      if (exitIdAinB) {
        await User.updateOne(
          { _id: myUserId },
          { $pull: { acceptFriends: userId } }
        );
      }

      // Kiểm tra xem B có trong danh sách requestFriends của A không
      const exitBinA = await User.findOne({
        _id: userId,
        requestFriends: myUserId,
      });

      if (exitBinA) {
        await User.updateOne(
          { _id: userId },
          { $pull: { requestFriends: myUserId } }
        );
      }
    });

    // Chức năng chấp nhận yêu cầu kết bạn
    // Chức năng chấp nhận yêu cầu kết bạn
    socket.on("CLIENT_ACCEPT_FRIEND", async (userId) => {
      const myUserId = res.locals.user.id;

      // Kiểm tra xem đã là bạn bè chưa
      const myUser = await User.findOne({ _id: myUserId });
      const alreadyFriends = myUser.listFriends.some(
        (friend) => friend.user_Id === userId
      );

      if (alreadyFriends) {
        // Nếu đã là bạn bè, không làm gì cả
        return;
      }

      // Kiểm tra xem A có trong danh sách acceptFriends của B không
      const exitIdAinB = await User.findOne({
        _id: myUserId,
        acceptFriends: userId,
      });

      // Kiểm tra xem B có trong danh sách requestFriends của A không
      const exitBinA = await User.findOne({
        _id: userId,
        requestFriends: myUserId,
      });

      let roomChat;

      // SỬA: Điều kiện tạo phòng chat
      if (exitIdAinB && exitBinA) {
        // Tạo phòng chat chung
        const dataRoom = {
          typeRoom: "friend",
          // SỬA: Thêm cả 2 user vào phòng
          users: [
            { user_Id: myUserId, role: "superAdmin" },
            { user_Id: userId, role: "superAdmin" },
          ],
        };

        roomChat = new RoomChat(dataRoom);
        await roomChat.save();

        // Cập nhật listFriends cho cả 2 user
        await User.updateOne(
          { _id: myUserId },
          {
            $push: {
              listFriends: {
                user_Id: userId,
                room_chat_Id: roomChat.id,
              },
            },
            $pull: { acceptFriends: userId },
          }
        );

        await User.updateOne(
          { _id: userId },
          {
            $push: {
              listFriends: {
                user_Id: myUserId,
                room_chat_Id: roomChat.id,
              },
            },
            $pull: { requestFriends: myUserId },
          }
        );

        // Thông báo cho cả hai người dùng rằng họ đã trở thành bạn bè
        socket.emit("SERVER_FRIEND_ACCEPTED", {
          userId: userId,
          myUserId: myUserId,
          roomChatId: roomChat.id, // Thêm roomChatId để client có thể sử dụng
        });

        socket.broadcast.emit("SERVER_FRIEND_ACCEPTED", {
          userId: myUserId,
          myUserId: userId,
          roomChatId: roomChat.id,
        });
      }
    });
  });
};
