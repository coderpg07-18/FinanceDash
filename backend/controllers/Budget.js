
//  controller - Budget.js

const mongoose = require("mongoose");
const Budget = require("../models/Budget");
const Transaction = require("../models/Transaction");
const ExpressError = require("../utils/ExpressError");


// GET /api/budgets?month=5&year=2026
module.exports.index = async (req, res) => {
  const { 
    month = new Date().getMonth() + 1, 
    year = new Date().getFullYear() 
  } = req.query;
  
  const ownerId = new mongoose.Types.ObjectId(req.user._id);

  const budgets = await Budget.find({ owner: ownerId, month, year })
  .populate(
    "category",
    "name icon color",
  );

  // Calculate spending for each budget
  const budgetsWithSpending = await Promise.all(
    budgets.map(async (budget) => {
      
      const spending = await Transaction.aggregate([
        {
          $match: {
            owner: ownerId,
            category: budget.category._id,
            type: "expense",
            date: {
              $gte: new Date(year, month - 1, 1),
              $lte: new Date(year, month, 0, 23, 59, 59),
            },
          },
        },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]);
      
      const spent = spending[0]?.total || 0;
      
      const percentage = Math.round((spent / budget.amount) * 100);
      
      return {
        ...budget.toObject(),
        spent,
        percentage,
        status:
          percentage >= 100
            ? "exceeded"
            : percentage >= budget.warningThreshold
              ? "warning"
              : "safe",
      };
    }),
  );

  res.json({ success: true, budgets: budgetsWithSpending });
};


// POST /api/budgets
module.exports.create = async (req, res, next) => {
  const { category, amount, month, year, warningThreshold } = req.body;
  
  const existing = await Budget.findOne({
    owner: req.user._id,
    category,
    month,
    year,
  });
  
  if (existing)
    return next(
      new ExpressError(
        400,
        "Budget already exists for this category and month",
      ),
    );
  
  const budget = await Budget.create({
    owner: req.user._id,
    category,
    amount,
    month,
    year,
    warningThreshold,
  });

  const populated = await budget.populate("category", "name icon color");

  res
    .status(201)
    .json({ success: true, message: "Budget created!", budget: populated });
};


// PUT /api/budgets/:id
module.exports.update = async (req, res, next) => {
  const budget = await Budget.findOneAndUpdate(
    { 
      _id: req.params.id, 
      owner: req.user._id 
    },
    req.body,
    { new: true },
  )
  .populate("category", "name icon color");
  
  if (!budget) return next(new ExpressError(404, "Budget not found"));
  
  res.json({ success: true, message: "Budget updated!", budget });
};


// DELETE /api/budgets/:id
module.exports.destroy = async (req, res, next) => {
  const budget = await Budget.findOneAndDelete({
    _id: req.params.id,
    owner: req.user._id,
  });
  
  if (!budget) return next(new ExpressError(404, "Budget not found"));
  
  res.json({ success: true, message: "Budget deleted!" });
};
