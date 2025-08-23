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
// SERVER_RETURN_INFO_ACCEPT_FRIEND
socket.on("SERVER_RETURN_INFO_ACCEPT_FRIEND", (data) => {
  // Trang lời mời đã nhận
  const dataUserAccept = document.querySelector("[data-user-accept]");
  if (dataUserAccept) {
    const userId = dataUserAccept.getAttribute("data-user-accept");
    if (userId === data.userId) {
      // Vẽ giao diện
      const div = document.createElement("div");
      div.classList.add("col-6");
      div.setAttribute("user-id", data.infoUserA._id);
      div.innerHTML = `
          <div class="box-user">
            <div class="inner-avatar">
              <img 
                src="${
                  data.infoUserA.avatar
                    ? data.infoUserA.avatar
                    : "https://images.icon-icons.com/1378/PNG/512/avatardefault_92824.png"
                }" 
      
                alt=${data.infoUserA.userName}
              >
            </div>

            <div class="inner-info">
              <div class="inner-name">${data.infoUserA.userName}</div>
              <div class="inner-buttons">
                <button 
                  class="btn btn-sm btn-primary mr-1" 
                  btn-accept-friend=${data.infoUserA._id}
                >
                  Chấp nhận
                </button>

                <button 
                  class="btn btn-sm btn-secondary mr-1" 
                  btn-refuse-friend=${data.infoUserA._id}
                >
                  Xóa
                </button>

                <button 
                  class="btn btn-sm btn-secondary mr-1" 
                  btn-deleted-friend 
                  disabled
                >
                  Đã xóa
                </button>

                <button 
                  class="btn btn-sm btn-primary mr-1" 
                  btn-accepted-friend 
                  disabled
                >
                  Đã chấp nhận
                </button>
              </div>
            </div>
          </div>

  `;
      dataUserAccept.appendChild(div);
      // Hết vẽ giao diện

      // Bắt sự kiện hủy
      const button = div.querySelector("[btn-refuse-friend]");
      button.addEventListener("click", () => {
        button.closest(".box-user").classList.add("refuse");
        const userId = button.getAttribute("btn-refuse-friend");
        socket.emit("CLIENT_DELETED_FRIEND", userId);
      });
      // Bắt sự kiện chấp nhận lời mòi kết bạn
      const buttonAccept = div.querySelector("[btn-accept-friend]");
      buttonAccept.addEventListener("click", () => {
        buttonAccept.closest(".box-user").classList.add("accepted");
        const userId = buttonAccept.getAttribute("btn-accept-friend");
        socket.emit("CLIENT_ACCEPT_FRIEND", userId);
      });
    }
  }
  // Trang danh sách người dùng
  const userDataUserNotFriend = document.querySelector(
    "[data-users-not-friend]"
  );
  if (userDataUserNotFriend) {
    const userId = userDataUserNotFriend.getAttribute("data-users-not-friend");
    if (userId === data.userId) {
      const boxUserRemove = userDataUserNotFriend.querySelector(
        `[user-id='${data.infoUserA._id}']`
      );
      if (boxUserRemove) {
        userDataUserNotFriend.removeChild(boxUserRemove);
      }
    }
  }
});

// SERVER_RETURN_USERID_CANCEL_FRIEND
socket.on("SERVER_RETURN_USERID_CANCEL_FRIEND", (data) => {
  const userIdA = data.userIdA;
  const boxUserRemove = document.querySelector(`[user-id='${userIdA}']`);
  if (boxUserRemove) {
    const dataUserAccept = document.querySelector("[data-user-accept]");
    const userIdB = accept.getAttribute("badge-light-accept");
    if (userIdB === data.userIdB) {
      dataUserAccept.removeChild(boxUserRemove);
    }
  }
});
// SERVER_RETURN_USER_ONLINE
socket.on("SERVER_RETURN_USER_ONLINE", (data) => {
  const dataUserFriends = document.querySelector("[data-users-friends]");
  if (dataUserFriends) {
    const boxUser = dataUserFriends.querySelector(`[user-id='${data.userId}']`);
    if (boxUser) {
      const boxStatus = boxUser.querySelector("[status]");
      boxStatus.setAttribute("status", "online");
      boxStatus.classList.remove("offline");
      boxStatus.classList.add("online");
      // update text hiển thị
      const innerStatus = boxUser.querySelector(".inner-status");
      if (innerStatus) {
        innerStatus.textContent = "Đang hoạt động";
        innerStatus.setAttribute("status", data.status);
      }
    }
  }
});
