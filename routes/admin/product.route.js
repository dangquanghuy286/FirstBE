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

router.get("/", dashboardController.index);

router.patch("/change-status/:status/:id", dashboardController.changeStatus);
router.patch("/change-multi", dashboardController.changeMulti);
router.delete("/deleteItem/:id", dashboardController.deleteItem);
router.get("/create", dashboardController.create);
router.post(
  "/create",
  upload.single("thumbnail"),
  dashboardController.createItem
);
module.exports = router;
