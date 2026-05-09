
// Users

const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isAdmin } = require("../middleware");
const userController = require("../controllers/User.js");
const { uploadAvatar } = require("../utils/cloudinaryConfig");

// Auth routes (signup/login/logout)
router.post("/signup", wrapAsync(userController.signup));
router.post("/login", wrapAsync(userController.login));



router.post("/forgot-password", wrapAsync(userController.forgotPassword));

router.post("/reset-password/:token", wrapAsync(userController.resetPassword));



// Protected routes
router.get("/profile", isLoggedIn, wrapAsync(userController.getProfile));
router.put("/profile", isLoggedIn, wrapAsync(userController.updateProfile));



router.put("/change-password", isLoggedIn, wrapAsync(userController.changePassword));

router.put("/avatar", isLoggedIn, uploadAvatar.single("avatar"), wrapAsync(userController.uploadAvatar));



// Admin-only routes (NEW - role-based)
router.get("/", isLoggedIn, isAdmin, wrapAsync(userController.getAllUsers));
router.delete("/:id", isLoggedIn, isAdmin, wrapAsync(userController.deleteUser));

module.exports = router;
