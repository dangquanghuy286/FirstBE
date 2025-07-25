const express = require("express");
const multer = require("multer");
const router = express.Router();

const upload = multer({
  // storage: storageMulter(),
  // limits: {
  //   fileSize: 5 * 1024 * 1024,
  // },
});

const dashboardController = require("../../controllers/admin/productCategory.controller");
const uploadCloud = require("../../middlewares/admin/uploadClound.middleware");
const validateController = require("../../validates/admin/productCategoryValidate");
router.get("/", dashboardController.index);
router.get("/create", dashboardController.create);
router.get("/edit/:id", dashboardController.edit);
router.post(
  "/create",
  upload.single("thumbnail"),
  uploadCloud.uploadCloud,
  validateController.createPost,
  dashboardController.createItem
);

router.patch(
  "/edit/:id",
  upload.single("thumbnail"),
  uploadCloud.uploadCloud,
  validateController.createPost,
  dashboardController.editItem
);

router.delete("/delete/:id", dashboardController.deleteItem);

module.exports = router;
