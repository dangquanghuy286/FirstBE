const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({
  // storage: storageMulter(),
  // limits: {
  //   fileSize: 5 * 1024 * 1024,
  // },
});
const uploadCloud = require("../../middlewares/admin/uploadClound.middleware");
const controller = require("../../controllers/admin/myaccount.controller");
router.get("/", controller.index);
router.get("/edit", controller.edit);
router.patch(
  "/edit",
  upload.single("avatar"),
  uploadCloud.uploadCloud,
  controller.editPatch
);
module.exports = router;
