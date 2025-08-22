const User = require("../../models/user.model");
const userSocket = require("../../sockets/client/user.socket");

// [GET]/users/notFriend
module.exports.notFriend = async (req, res) => {
  userSocket(res);
  const userId = res.locals.user.id;
  const myUser = await User.findOne({ _id: userId });

  const requestFriend = myUser.requestFriends || [];
  const acceptFriend = myUser.acceptFriends || [];
  const listFriends = myUser.listFriends || [];

  // Lấy danh sách ID của những người đã là bạn bè
  const listFriendsId = listFriends.map((friend) => friend.user_Id);

  // CẢI THIỆN: Thêm điều kiện loại trừ những người đã là bạn bè
  const users = await User.find({
    $and: [
      { _id: { $ne: userId } }, // Không phải chính mình
      { _id: { $nin: requestFriend } }, // Không có trong danh sách đã gửi yêu cầu
      { _id: { $nin: acceptFriend } }, // Không có trong danh sách đã nhận yêu cầu
      { _id: { $nin: listFriendsId } }, // Không có trong danh sách bạn bè
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

  // CẢI THIỆN: Thêm kiểm tra để loại trừ những người đã là bạn bè
  const listFriends = myUser.listFriends || [];
  const listFriendsId = listFriends.map((friend) => friend.user_Id);

  const users = await User.find({
    $and: [
      { _id: { $in: requestFriend } }, // Có trong danh sách đã gửi yêu cầu
      { _id: { $nin: listFriendsId } }, // Không có trong danh sách bạn bè
    ],
    status: "active",
    deleted: false,
  }).select("_id avatar userName");

  res.render("client/pages/users/request", {
    title: "RequestFriend",
    users: users,
  });
};

// [GET]/users/accept
module.exports.acceptFriend = async (req, res) => {
  userSocket(res);
  const userId = res.locals.user.id;
  const myUser = await User.findOne({ _id: userId });

  const acceptFriend = myUser.acceptFriends || [];

  // CẢI THIỆN: Thêm kiểm tra để loại trừ những người đã là bạn bè
  const listFriends = myUser.listFriends || [];
  const listFriendsId = listFriends.map((friend) => friend.user_Id);

  const users = await User.find({
    $and: [
      { _id: { $in: acceptFriend } }, // Có trong danh sách đã nhận yêu cầu
      { _id: { $nin: listFriendsId } }, // Không có trong danh sách bạn bè
    ],
    status: "active",
    deleted: false,
  }).select("_id avatar userName");

  res.render("client/pages/users/accept", {
    title: "AcceptFriend",
    users: users,
  });
};

// [GET]/users/friends
module.exports.friendList = async (req, res) => {
  userSocket(res);
  const userId = res.locals.user.id;
  const myUser = await User.findOne({ _id: userId });

  const listFriends = myUser.listFriends || [];
  const listFriendId = listFriends.map((item) => item.user_Id);

  const users = await User.find({
    _id: { $in: listFriendId },
    status: "active",
    deleted: false,
  }).select("_id avatar userName statusOnline");

  res.render("client/pages/users/friendList", {
    title: "Friends",
    friends: users,
  });
};
