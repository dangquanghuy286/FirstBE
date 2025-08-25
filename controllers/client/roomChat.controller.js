const RoomChat = require("../../models/roomchat.model");
const User = require("../../models/user.model");

// [GET] /rooms-chat/
module.exports.index = async (req, res) => {
  res.render("client/pages/roomChat/index");
};
// [GET] /rooms-chat/create
module.exports.create = async (req, res) => {
  const userFriend = res.locals.user.listFriends;
  for (const friend of userFriend) {
    const infoFriend = await User.findOne({
      _id: friend.user_Id,
      deleted: false,
    }).select("userName avatar");
    friend.infoFriend = infoFriend;
  }
  res.render("client/pages/roomChat/create", {
    title: "Create Room",
    userFriend: userFriend,
  });
};
// [POST] /rooms-chat/create
module.exports.createPost = async (req, res) => {
  const title = req.body.roomName;
  const userId = req.body.members;
  const dataRoom = {
    title: title,
    typeRoom: "group",
    users: [],
  };
  for (const user of userId) {
    dataRoom.users.push({
      user_Id: user,
      role: "user",
    });
  }
  dataRoom.users.push({
    user_Id: res.locals.user.id,
    role: "supperAdmin",
  });
  const roomChat = new RoomChat(dataRoom);
  await roomChat.save();

  res.redirect(`/chat/${roomChat.id}`);
};
