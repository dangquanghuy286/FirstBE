// Chức năng gủi yêu cầu
const listBtnAddFriend = document.querySelectorAll("[btn-add-friend]");
if (listBtnAddFriend.length > 0) {
  listBtnAddFriend.forEach((button) => {
    button.addEventListener("click", () => {
      button.closest(".box-user").classList.add("add");
      const userId = button.getAttribute("btn-add-friend");
      socket.emit("CLIENT_ADD_FRIEND", userId);
    });
  });
}
//Chức năng hủy gủy gửi yêu cầu
const listBtnCancelFriend = document.querySelectorAll("[btn-cancel-friend]");
if (listBtnCancelFriend.length > 0) {
  listBtnCancelFriend.forEach((button) => {
    button.addEventListener("click", () => {
      button.closest(".box-user").classList.remove("add");
      const userId = button.getAttribute("btn-cancel-friend");
      socket.emit("CLIENT_CANCEL_FRIEND", userId);
    });
  });
}
// Chức năng xóa lời mời kết bạn
const listBtnDeletedFriend = document.querySelectorAll("[btn-refuse-friend]");
if (listBtnDeletedFriend.length > 0) {
  listBtnDeletedFriend.forEach((button) => {
    button.addEventListener("click", () => {
      button.closest(".box-user").classList.add("refuse");
      const userId = button.getAttribute("btn-refuse-friend");
      socket.emit("CLIENT_DELETED_FRIEND", userId);
    });
  });
}
// Chức năng chấp nhận lời mời kết bạn
const listBtnAcceptFriend = document.querySelectorAll("[btn-accept-friend]");
if (listBtnAcceptFriend.length > 0) {
  listBtnAcceptFriend.forEach((button) => {
    button.addEventListener("click", () => {
      button.closest(".box-user").classList.add("accepted");
      const userId = button.getAttribute("btn-accept-friend");
      socket.emit("CLIENT_ACCEPT_FRIEND", userId);
    });
  });
}
// SERVER_RETURN_ACCEPT_FRIEND
const accept = document.querySelector("[badge-light-accept]");
if (accept) {
  const userId = accept.getAttribute("badge-light-accept");
  socket.on("SERVER_LENGTH_ACCEPT_FRIEND", (data) => {
    if (userId === data.userId) {
      accept.innerHTML = data.lengthFriend;
    }
  });
}
