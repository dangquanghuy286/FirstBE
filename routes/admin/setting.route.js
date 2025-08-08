const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const uploadCloud = require("../../middlewares/admin/uploadClound.middleware");
const settingController = require("../../controllers/admin/setting.controller");
router.get("/general", settingController.settings);
router.patch(
  "/general",
  upload.single("logo"),
  uploadCloud.uploadCloud,
  settingController.updateSettings
);
module.exports = router;
