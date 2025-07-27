const express = require("express");
const multer = require("multer");
const upload = multer({
  // storage: storageMulter(),
  // limits: {
  //   fileSize: 5 * 1024 * 1024,
  // },
});
// const validateController = require("../../validates/admin/productValidate");
const uploadCloud = require("../../middlewares/admin/uploadClound.middleware");
const router = express.Router();
const accountController = require("../../controllers/admin/account.controller");
router.get("/", accountController.account);
router.get("/create", accountController.create);
router.post(
  "/create",
  upload.single("avatar"),
  uploadCloud.uploadCloud,
  accountController.createPost
);

router.get("/edit/:id", accountController.edit);
module.exports = router;
router.patch(
  "/edit/:id",
  upload.single("avatar"),
  uploadCloud.uploadCloud,
  accountController.editPatch
);
