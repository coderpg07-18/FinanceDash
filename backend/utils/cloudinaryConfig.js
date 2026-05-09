
//  cloudinaryConfig

const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// ** Avatar storage **
const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "financedash/avatars",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 200, height: 200, crop: "fill" }],
  },
});

// ** Receipt storage **
const receiptStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "financedash/receipts",
    allowed_formats: ["jpg", "jpeg", "png", "pdf"],
  },
});

module.exports.uploadAvatar = multer({ storage: avatarStorage });
module.exports.uploadReceipt = multer({ storage: receiptStorage });
module.exports.cloudinary = cloudinary;
