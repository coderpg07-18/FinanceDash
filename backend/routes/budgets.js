const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn } = require("../middleware");
const c = require("../controllers/budget");

router.get("/", isLoggedIn, wrapAsync(c.index));
router.post("/", isLoggedIn, wrapAsync(c.create));
router.put("/:id", isLoggedIn, wrapAsync(c.update));
router.delete("/:id", isLoggedIn, wrapAsync(c.destroy));

module.exports = router;