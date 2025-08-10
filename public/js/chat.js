import * as Popper from "https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js";
const upload = new FileUploadWithPreview.FileUploadWithPreview("my-unique-id");
// Cache DOM elements
const formSendMessage = document.querySelector(".chat .inner-form");
const bodyChat = document.querySelector(".chat .inner-body");
const chatInput = document.querySelector(
  ".chat .inner-form input[name='content']"
);
const elementListTyping = document.querySelector(".chat .inner-list-typing");
const myId = document.querySelector("[my-id]")?.getAttribute("my-id");

// Client send message
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
  if (!bodyChat || !elementListTyping) return;

  const div = document.createElement("div");
  const isMyMessage = myId === data.userId;

  // Add class based on sender
  div.classList.add(isMyMessage ? "inner-outgoing" : "inner-incoming");

  // Create HTML structure
  div.innerHTML = `
    ${!isMyMessage ? `<div class="inner-name">${data.userName}</div>` : ""}
    <div class="inner-message-row">
      ${
        !isMyMessage
          ? `<div class="inner-avatar">
             <img src="${
               data.avatar ||
               "https://images.icon-icons.com/1378/PNG/512/avatardefault_92824.png"
             }" 
                  alt="${data.userName || "Khách"} avatar">
           </div>`
          : ""
      }
      <div class="inner-content">${data.content}</div>
    </div>
  `;

  bodyChat.insertBefore(div, elementListTyping);
  bodyChat.scrollTop = bodyChat.scrollHeight;
});

// Auto scroll to bottom on page load
if (bodyChat) {
  bodyChat.scrollTop = bodyChat.scrollHeight;
}

// Show Popup with Popper.js
const button = document.querySelector(".button-icon");
const tooltip = document.querySelector(".tooltip");
if (button && tooltip) {
  Popper.createPopper(button, tooltip);
  button.onclick = () => {
    tooltip.classList.toggle("shown");
  };
}

// Show Typing
var timeout;
const showTyping = () => {
  socket.emit("CLIENT_TYPING", "show");
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    socket.emit("CLIENT_TYPING", "hidden");
  }, 3000);
};
// Emoji Picker
const emojiPicker = document.querySelector("emoji-picker");
if (emojiPicker && chatInput) {
  emojiPicker.addEventListener("emoji-click", (event) => {
    chatInput.value += event.detail.unicode;
    // Luôn focus vào input sau khi chọn emoji
    const end = chatInput.value.length;
    chatInput.setSelectionRange(end, end);
    chatInput.focus();
    showTyping();
  });
}

// Typing indicator
if (chatInput && elementListTyping) {
  chatInput.addEventListener("keyup", () => {
    showTyping();
  });

  // Server return Typing
  socket.on("SERVER_TYPING", (data) => {
    if (data.userId === myId) return;

    const existingTyping = elementListTyping.querySelector(
      `[user-id="${data.userId}"]`
    );

    if (data.type === "show") {
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
      bodyChat.appendChild(elementListTyping);
      bodyChat.scrollTop = bodyChat.scrollHeight;
    } else if (data.type === "hidden" && existingTyping) {
      elementListTyping.removeChild(existingTyping);
    }
  });
}
