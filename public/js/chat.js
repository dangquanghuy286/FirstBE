import * as Popper from "https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js";

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
    <div class="inner-message-row">
      ${
        myId !== data.userId
          ? `<div class="inner-avatar">
               <img src="${
                 data.avatar ||
                 "https://images.icon-icons.com/1378/PNG/512/avatardefault_92824.png"
               }" alt="${data.userName || "Khách avatar"}">
             </div>`
          : ""
      }
      <div class="inner-content">${data.content}</div>
    </div>
  `;

  body.appendChild(div);
  body.scrollTop = body.scrollHeight;
});

// Lấy tin nhắn mới nhất khi lỡ reload
const bodyChat = document.querySelector(".chat .inner-body");
if (bodyChat) {
  bodyChat.scrollTop = bodyChat.scrollHeight;
}
// Show IconChat
// Show Popup
const button = document.querySelector(".button-icon");
if (button) {
  const tooltip = document.querySelector(".tooltip");
  Popper.createPopper(button, tooltip);
  button.onclick = () => {
    tooltip.classList.toggle("shown");
  };
}
// Insert Emoji Picker
const emojiPicker = document.querySelector("emoji-picker");
if (emojiPicker) {
  // Initialize emoji picker
  emojiPicker.addEventListener("emoji-click", (event) => {
    const chatInput = document.querySelector(
      ".chat .inner-form input[name='content']"
    );
    chatInput.value += event.detail.unicode;
  });
  // Input
  chatInput.addEventListener("keyup", () => {
    socket.emit("CLIENT_TYPING", "show");
    setTimeout(() => {
      socket.emit("CLIENT_TYPING", "hidden");
    }, 3000);
  });
}
// Server return Typing
const elementListTyping = document.querySelector(".chat .inner-list-typing");
if (elementListTyping) {
  socket.on("SERVER_TYPING", (data) => {
    const existingTyping = elementListTyping.querySelector(
      `[user-id="${data.userId}"]`
    );

    if (data.type === "show") {
      // Nếu chưa có phần tử cho userId này, thêm mới
      if (!existingTyping) {
        const boxTyping = document.createElement("div");
        boxTyping.classList.add("box-typing");
        boxTyping.setAttribute("user-id", data.userId);
        boxTyping.innerHTML = `
          <div class="inner-name">${data.userName}</div>
          <div class="inner-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        `;
        elementListTyping.appendChild(boxTyping);
      }
    } else if (data.type === "hidden") {
      // Nếu có phần tử, xóa nó đi
      if (existingTyping) {
        elementListTyping.removeChild(existingTyping);
      }
    }
  });
}
