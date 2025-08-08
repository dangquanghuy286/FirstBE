// Client send message
const formSendMessage = document.querySelector(".chat .inner-form");
if (formSendMessage) {
  formSendMessage.addEventListener("submit", (event) => {
    event.preventDefault();
    const content = event.target.elements.content.value;
    if (content) {
      socket.emit("CLIENT_SEND_MESSAGE", content);
      event.target.elements.content.value = "";
    }
  });
}

// Server send message
socket.on("SERVER_SEND_MESSAGE", (data) => {
  const myId = document.querySelector("[my-id]").getAttribute("my-id");
  const body = document.querySelector(".chat .inner-body");
  const div = document.createElement("div");

  // Thêm class dựa trên người gửi
  if (myId === data.userId) {
    div.classList.add("inner-outgoing");
  } else {
    div.classList.add("inner-incoming");
  }

  // Tạo cấu trúc HTML - LUÔN LUÔN hiển thị tên cho tin nhắn incoming
  div.innerHTML = `
    ${
      myId !== data.userId
        ? `<div class="inner-name">${data.userName}</div>`
        : ""
    }
    <div class="inner-content">${data.content}</div>
  `;

  body.appendChild(div);
  body.scrollTop = body.scrollHeight;
});

// Lấy tin nhắn mới nhất khi lỡ reload
const bodyChat = document.querySelector(".chat .inner-body");
if (bodyChat) {
  bodyChat.scrollTop = bodyChat.scrollHeight;
}
