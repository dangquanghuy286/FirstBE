const express = require("express");
const multer = require("multer");
const storageMulter = require("../../helpers/storageMulter");
const router = express.Router();
const upload = multer({
  storage: storageMulter(),
  limits: {
    fileSize: 5 * 1024 * 1024, // Giới hạn 5MB
  },
});
const dashboardController = require("../../controllers/admin/product.controller");
const validateController = require("../../validates/admin/productValidate");

router.get("/", dashboardController.index);

router.patch("/change-status/:status/:id", dashboardController.changeStatus);
router.patch("/change-multi", dashboardController.changeMulti);
router.delete("/deleteItem/:id", dashboardController.deleteItem);
router.get("/create", dashboardController.create);
router.post(
  "/create",
  upload.single("thumbnail"),
  validateController.createPost,
  dashboardController.createItem
);
router.get("/edit/:id", dashboardController.viewEdit);
router.patch(
  "/edit/:id",
  upload.single("thumbnail"),
  validateController.createPost,
  dashboardController.editPatch
);
module.exports = router;
