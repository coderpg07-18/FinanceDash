
// user.js
// signup/login/logout -> JWT-based

const User = require("../models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const ExpressError = require("../utils/ExpressError");
const { sendPasswordResetEmail } = require("../utils/sendEmail");


// Helper: sign JWT
const signToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "3d" },
  );
};


// POST /api/users/signup 
module.exports.signup = async (req, res, next) => {
  const { username, email, password, role } = req.body;

  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  
  if (existingUser) {
    return next(new ExpressError(400, "Username or email already exists"));
  }

  const user = new User({ username, email, password, role: role || "user" });
  await user.save();

  const token = signToken(user);
  
  res.status(201).json({
    success: true,
    message: `Welcome, ${user.username}!`,
    token,
    
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  });
};


// POST /api/users/login 
module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return next(new ExpressError(401, "Invalid email or password"));
  }

  const token = signToken(user);
  res.json({
    success: true,
    message: `Welcome back, ${user.username}!`,
    token,
    
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    },
  });
};


// GET /api/users/profile
module.exports.getProfile = async (req, res, next) => {
  const user = await User.findById(req.user._id).select("-password");
  
  if (!user) return next(new ExpressError(404, "User not found"));
  
  res.json({ success: true, user });
};


// PUT /api/users/profile
module.exports.updateProfile = async (req, res, next) => {
  const { username, email } = req.body;
  
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { username, email },
    { new: true, runValidators: true },
  )
  .select("-password");
  
  res.json({ success: true, message: "Profile updated!", user });
};


// Upload Avatar 
module.exports.uploadAvatar = async (req, res, next) => {
  if (!req.file) return next(new ExpressError(400, "No file uploaded"));
  
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { avatar: { url: req.file.path, filename: req.file.filename } },
    { new: true },
  )
  .select("-password");
  
  res.json({ success: true, message: "Avatar updated!", user });
};


// Change Password 
module.exports.changePassword = async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  
  const user = await User.findById(req.user._id);
  
  if (!(await user.comparePassword(currentPassword)))
    return next(new ExpressError(400, "Current password is incorrect"));
  
  user.password = newPassword;
  await user.save();

  res.json({ success: true, message: "Password changed successfully!" });
};


// Forgot Password 
module.exports.forgotPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  
  if (!user)
    return next(new ExpressError(404, "No account found with that email"));
  
  const resetToken = crypto.randomBytes(32).toString("hex");
  // console.log("RAW RESET TOKEN:", resetToken);
  
  user.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  
  user.passwordResetExpires = Date.now() + 15 * 60 * 1000; // 15 min

  await user.save({ validateBeforeSave: false });

  try {
    await sendPasswordResetEmail(user.email, resetToken);
    res.json({ success: true, message: "Password reset email sent!" });
  
  } catch (err) {
    // console.log(err);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    
    await user.save({ validateBeforeSave: false });
    return next(new ExpressError(500, "Error sending email. Try again."));
  }
};


// Reset Password 
module.exports.resetPassword = async (req, res, next) => {
  // console.log("TOKEN FROM URL:", req.params.token);
  
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  // console.log(hashedToken);
  
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  
  if (!user)
    return next(new ExpressError(400, "Token is invalid or has expired"));
  
  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  
  await user.save();
  
  const token = signToken(user);
  
  res.json({ success: true, message: "Password reset successful!", token });
};


module.exports.getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json({ success: true, users });
};


module.exports.deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "User deleted" });
};
