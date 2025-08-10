import * as Popper from "https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js";
import { FileUploadWithPreview } from "https://cdn.jsdelivr.net/npm/file-upload-with-preview/+esm";

const upload = new FileUploadWithPreview("imgUpload", {
  multiple: true,
  maxFileCount: 6,
});

// Cache DOM elements
const formSendMessage = document.querySelector(".chat .inner-form");
const bodyChat = document.querySelector(".chat .inner-body");
const chatInput = document.querySelector(
  ".chat .inner-form input[name='content']"
);
const elementListTyping = document.querySelector(".chat .inner-list-typing");
const myId = document.querySelector("[my-id]")?.getAttribute("my-id");
const fileToggle = document.querySelector("#fileToggle");
const emojiBtn = document.querySelector("#emojiBtn");
const tooltip = document.querySelector(".tooltip");

// Client send message
if (formSendMessage) {
  formSendMessage.addEventListener("submit", (event) => {
    event.preventDefault();
    const content = event.target.elements.content.value;
    const images = upload.cachedFileArray;
    if (content || images.length > 0) {
      socket.emit("CLIENT_SEND_MESSAGE", {
        content: content,
        images: images,
      });

      event.target.elements.content.value = "";
      upload.resetPreviewPanel();
      socket.emit("CLIENT_TYPING");
    }
  });
}

// Server send message
socket.on("SERVER_SEND_MESSAGE", (data) => {
  if (!bodyChat || !elementListTyping) return;

  const div = document.createElement("div");
  const isMyMessage = myId === data.userId;

  div.classList.add(isMyMessage ? "inner-outgoing" : "inner-incoming");

  // Tạo nội dung cho .inner-message-content
  let messageContent = "";
  if (data.content) {
    messageContent += `<div class="inner-content">${data.content}</div>`;
  }
  if (data.images && data.images.length > 0) {
    messageContent += `<div class="inner-images">`;
    data.images.forEach((image) => {
      messageContent += `<img src="${image}" alt="Uploaded image">`;
    });
    messageContent += `</div>`;
  }

  div.innerHTML = `
    ${!isMyMessage ? `<div class="inner-name">${data.userName}</div>` : ""}
    <div class="${isMyMessage ? "inner-message-content" : "inner-message-row"}">
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
      ${
        messageContent
          ? `<div class="inner-message-content">${messageContent}</div>`
          : ""
      }
    </div>
  `;

  bodyChat.insertBefore(div, elementListTyping);
  bodyChat.scrollTop = bodyChat.scrollHeight;
  // Pre view Full Image

  const gallery = new Viewer(div);
});

// Auto scroll to bottom on page load
if (bodyChat) {
  bodyChat.scrollTop = bodyChat.scrollHeight;
}

// Show Emoji Popup with Popper.js
let emojiPopper;
if (emojiBtn && tooltip) {
  emojiPopper = Popper.createPopper(emojiBtn, tooltip, {
    placement: "top",
  });
  emojiBtn.onclick = () => {
    tooltip.classList.toggle("shown");
    filePondPopup.classList.remove("shown"); // Ẩn FilePond popup nếu đang mở
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
// Pre view Full Image
const bodyChatPreview = document.querySelector(".chat .inner-body ");

if (bodyChatPreview) {
  const gallery = new Viewer(bodyChatPreview);
}
