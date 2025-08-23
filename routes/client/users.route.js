const express = require("express");
const router = express.Router();
const userController = require("../../controllers/client/users.controller");

router.get("/", userController.friend);
router.get("/not-friends", userController.notFriend);
router.get("/request", userController.requestFriend);
router.get("/accept", userController.acceptFriend);
router.get("/friends", userController.friendList);

module.exports = router;
