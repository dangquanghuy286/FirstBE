const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/auth.controller");
const validate = require("../../validates/client/user.validate");
const authMiddleware = require("../../middlewares/client/user.middleware");
router.get("/logout", controller.logout);
router.get("/login", controller.login);
router.post("/login", validate.loginPost, controller.loginPost);
router.get("/register", controller.register);
router.post("/register", validate.registerPost, controller.registerPost);
router.get("/password/sendEmail", controller.sendEmail);
router.post(
  "/password/forgot-password",
  validate.forgotPost,
  controller.forgotPassword
);
router.get("/password/verify-otp", controller.verifyOTP);
router.post("/password/verify-otp", controller.postOTP);
router.get("/password/reset-password", controller.resetPassword);
router.post(
  "/password/reset-password",
  validate.resetPasswordPost,
  controller.resetPasswordPost
);
router.get("/profile", authMiddleware.requireAuth, controller.profile);
module.exports = router;
