const express = require("express");
const router = express.Router();
const dashboardController = require("../../controllers/admin/product.controller");

router.get("/", dashboardController.index);

router.patch("/change-status/:status/:id", dashboardController.changeStatus);
router.patch("/change-multi", dashboardController.changeMulti);
router.delete("/deleteItem/:id", dashboardController.deleteItem);
module.exports = router;
