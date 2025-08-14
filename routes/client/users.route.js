const express = require("express");
const router = express.Router();
const userController = require("../../controllers/client/users.controller");

router.get("/not-friends", userController.notFriend);

module.exports = router;
