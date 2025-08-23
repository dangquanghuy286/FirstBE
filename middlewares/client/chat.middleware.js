const RoomChat = require("../../models/roomchat.model");

module.exports.isAccess = async (req, res, next) => {
  const roomChatId = req.params.roomChatId;
  const userId = res.locals.user.id;
  const isExitInRoom = await RoomChat.findOne({
    _id: roomChatId,
    "users.user_Id": userId,
    deleted: false,
  });

  if (isExitInRoom) {
    next();
  } else {
    res.redirect("/");
  }
};
