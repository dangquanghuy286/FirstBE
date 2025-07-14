const express = require("express");
const router = express.Router();
const dashboardController = require("../../controllers/admin/product.controller");

router.get("/", dashboardController.index);
module.exports = router;
