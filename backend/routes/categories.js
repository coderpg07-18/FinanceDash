
//  categories 

const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, validateCategory } = require("../middleware");
const categoryController = require("../controllers/Category.js");

router.get("/", isLoggedIn, wrapAsync(categoryController.index));
router.post("/", isLoggedIn, validateCategory, wrapAsync(categoryController.create));
router.put("/:id", isLoggedIn, validateCategory, wrapAsync(categoryController.update));
router.delete("/:id", isLoggedIn, wrapAsync(categoryController.destroy));

module.exports = router;
