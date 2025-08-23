const express = require("express");
const router = express.Router();
const chatController = require("../../controllers/client/chat.controller");
const chatMid = require("../../middlewares/client/chat.middleware");
router.get("/:roomChatId", chatMid.isAccess, chatController.index);

module.exports = router;
