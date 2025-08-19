const User = require("../../models/user.model");
const userSocket = require("../../sockets/client/user.socket");

module.exports.notFriend = async (req, res) => {
  userSocket(res);

  const userId = res.locals.user.id;
  const myUser = await User.findOne({ _id: userId });
  const requestFriend = myUser.requestFriends || [];
  const acceptFriend = myUser.acceptFriends || [];

  const users = await User.find({
    // $nor: [
    //   { _id: userId },
    //   { _id: { $in: requestFriend } },
    //   { _id: { $in: acceptFriend } },
    // ],
    $and: [
      { _id: { $ne: userId } },
      { _id: { $nin: requestFriend } },
      { _id: { $nin: acceptFriend } },
    ],
    status: "active",
    deleted: false,
  }).select("_id avatar userName");

  res.render("client/pages/users/notFriend", {
    title: "NotFriend",
    users: users,
  });
};

// [GET]/users/request
module.exports.requestFriend = async (req, res) => {
  userSocket(res);

  const userId = res.locals.user.id;
  const myUser = await User.findOne({ _id: userId });
  const requestFriend = myUser.requestFriends || [];

  const users = await User.find({
    _id: { $in: requestFriend },
    status: "active",
    deleted: false,
  }).select("_id avatar userName");

  res.render("client/pages/users/request", {
    title: "RequestFriend",
    users: users,
  });
  console.log(users);
};
