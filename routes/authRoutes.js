const express = require("express");
const { upload, compressImage } = require("../middleware/upload");
const router = express.Router();
const {
  registerUser,
  loginUser,
  refreshToken,
  logout,
  forgotPassword,
  verifyOtp,
  resetPassword,
} = require("../controllers/authControllers");

router.post(
  "/register",
  upload.single("user_pic"),
  compressImage,
  registerUser,
);
router.post("/login", loginUser);
router.post("/refresh", refreshToken);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

module.exports = router;
