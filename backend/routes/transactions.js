
//  transactions --- index/show/create/update/destroy

const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isOwner, validateTransaction } = require("../middleware");
const transactionController = require("../controllers/transaction");

// GET /api/transactions (index) 
router.get("/", isLoggedIn, wrapAsync(transactionController.index));

// GET /api/transactions/summary (dashboard) 
router.get("/summary", isLoggedIn, wrapAsync(transactionController.getSummary));



router.get("/reports/monthly", isLoggedIn, wrapAsync(transactionController.monthlyReport));

router.get("/reports/categories", isLoggedIn, wrapAsync(transactionController.categoryReport));

router.get("/export", isLoggedIn, wrapAsync(transactionController.exportCSV));



// GET /api/transactions/:id (show)
router.get("/:id", isLoggedIn, wrapAsync(transactionController.show));

// POST /api/transactions (create) 
router.post("/", isLoggedIn, validateTransaction, wrapAsync(transactionController.create));

// PUT /api/transactions/:id (update)
router.put("/:id", isLoggedIn, isOwner, validateTransaction, wrapAsync(transactionController.update));

// DELETE /api/transactions/:id (destroy)
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(transactionController.destroy));

module.exports = router;
