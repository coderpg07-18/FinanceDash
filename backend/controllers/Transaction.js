
// Transaction - index/show/new/create/edit/update/destroy

const Transaction = require("../models/Transaction");
const mongoose = require("mongoose");
const User = require("../models/User");
const ExpressError = require("../utils/ExpressError");

// GET /api/transactions
module.exports.index = async (req, res) => {
  const {
    type,
    category,
    startDate,
    endDate,
    search,
    page = 1,
    limit = 10,
  } = req.query;

  
  // Admin sees all, user sees only their own
  const filter =
    req.user.role === "admin"
      ? {}
      : { owner: new mongoose.Types.ObjectId(req.user._id) };

  if (type) filter.type = type;
  if (category) filter.category = new mongoose.Types.ObjectId(category);
  
  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
  }
  
  if (search) filter.title = { $regex: search, $options: "i" };

  
  const skip = (page - 1) * limit;
  
  const [transactions, total] = await Promise.all([
    Transaction.find(filter)
      .populate("category", "name color icon")
      .populate("owner", "username email")
      .sort({ date: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Transaction.countDocuments(filter),
  ]);

  res.json({
    success: true,
    transactions,
    
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      hasMore: skip + transactions.length < total,
    },
  });
};


// GET /api/transactions/summary (dashboard stats)
module.exports.getSummary = async (req, res) => {
  const { month, year } = req.query;
  
  const filter =
    req.user.role === "admin"
      ? {}
      : { owner: new mongoose.Types.ObjectId(req.user._id) };

  if (month && year) {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59);
    filter.date = { $gte: start, $lte: end };
  }

  const summary = await Transaction.aggregate([
    { $match: filter },    
    {
      $group: {
        _id: "$type",
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
  ]);

  const income = summary.find((s) => s._id === "income") || {
    total: 0,
    count: 0,
  };

  const expense = summary.find((s) => s._id === "expense") || {
    total: 0,
    count: 0,
  };

  res.json({
    success: true,
    summary: {
      income: income.total,
      expense: expense.total,
      balance: income.total - expense.total,
      transactionCount: income.count + expense.count,
    },
  });
};


// GET /api/transactions/:id 
module.exports.show = async (req, res, next) => {
  const transaction = await Transaction.findById(req.params.id)
    .populate("category", "name color icon")
    .populate("owner", "username email");

  if (!transaction) return next(new ExpressError(404, "Transaction not found"));
  
  res.json({ success: true, transaction });
};


// POST /api/transactions
module.exports.create = async (req, res, next) => {
  const transaction = new Transaction({ ...req.body, owner: req.user._id });
  await transaction.save();

  // Update user totals
  const updateField =
    transaction.type === "income" ? "totalIncome" : "totalExpense";
  
  await User.findByIdAndUpdate(req.user._id, {
    $inc: { [updateField]: transaction.amount },
  });

  const populated = await transaction.populate("category", "name color icon");
  
  res.status(201).json({
    success: true,
    message: "Transaction added successfully!",
    transaction: populated,
  });
};


// PUT /api/transactions/:id
module.exports.update = async (req, res, next) => {
  const old = await Transaction.findById(req.params.id);
  
  if (!old) return next(new ExpressError(404, "Transaction not found"));

  // *** Reverse old amount from user totals ***
  const oldField = old.type === "income" ? "totalIncome" : "totalExpense";
  
  await User.findByIdAndUpdate(old.owner, {
    $inc: { [oldField]: -old.amount },
  });

  const transaction = await Transaction.findByIdAndUpdate(
    req.params.id,
    { ...req.body },
    { new: true, runValidators: true },
  ).populate("category", "name color icon");

  // *** Apply new amount to user totals ***
  const newField =
    transaction.type === "income" ? "totalIncome" : "totalExpense";
  
  await User.findByIdAndUpdate(transaction.owner, {
    $inc: { [newField]: transaction.amount },
  });

  res.json({ success: true, message: "Transaction updated!", transaction });
};


// DELETE /api/transactions/:id
module.exports.destroy = async (req, res, next) => {
  const transaction = await Transaction.findByIdAndDelete(req.params.id);
  
  if (!transaction) return next(new ExpressError(404, "Transaction not found"));

  // *** Reverse amount from user totals ***
  const field = transaction.type === "income" ? "totalIncome" : "totalExpense";
  
  await User.findByIdAndUpdate(transaction.owner, {
    $inc: { [field]: -transaction.amount },
  });

  res.json({ success: true, message: "Transaction deleted!" });
};


// Monthly Report
module.exports.monthlyReport = async (req, res) => {
  const { year = new Date().getFullYear() } = req.query;
  
  const filter = req.user.role === "admin" ? {} : { owner: new mongoose.Types.ObjectId(req.user._id) };
  
  filter.date = { $gte: new Date(year, 0, 1), $lte: new Date(year, 11, 31, 23, 59, 59) };
 
  const data = await Transaction.aggregate([
    { $match: filter },
    { $group: { _id: { month: { $month: "$date" }, type: "$type" }, total: { $sum: "$amount" } } },
    { $sort: { "_id.month": 1 } },
  ]);
 
  const months = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    name: new Date(2026, i, 1).toLocaleString("default", { month: "short" }),
    income: 0,
    expense: 0,
    balance: 0,
  }));
 
  data.forEach(({ _id, total }) => {
    if (_id.type === "income") months[_id.month - 1].income = total;
    else months[_id.month - 1].expense = total;
  });
 
  months.forEach((m) => { m.balance = m.income - m.expense; });
  res.json({ success: true, data: months });
};


// Category Report 
module.exports.categoryReport = async (req, res) => {
  const { month, year, type = "expense" } = req.query;
  
  const filter = req.user.role === "admin" ? { type } : { owner: new mongoose.Types.ObjectId(req.user._id), type };
 
  if (month && year) {
    filter.date = {
      $gte: new Date(year, month - 1, 1),
      $lte: new Date(year, month, 0, 23, 59, 59),
    };
  }
 
  const data = await Transaction.aggregate([
    { $match: filter },
    { $group: { _id: "$category", total: { $sum: "$amount" }, count: { $sum: 1 } } },
    { $lookup: { from: "categories", localField: "_id", foreignField: "_id", as: "category" } },
    { $unwind: "$category" },
    { $sort: { total: -1 } },
  ]);
 
  res.json({ success: true, data });
};


// Export CSV
module.exports.exportCSV = async (req, res) => {
  const filter =
    req.user.role === "admin"
      ? {}
      : { owner: new mongoose.Types.ObjectId(req.user._id) };
  
  const transactions = await Transaction.find(filter)
    .populate("category", "name")
    .sort({ date: -1 });
  
  const rows = [["Title", "Amount", "Type", "Category", "Date", "Description"]];
  
  transactions.forEach((t) => {
    rows.push([
      t.title,
      t.amount,
      t.type,
      t.category?.name || "",
      new Date(t.date).toLocaleDateString(),
      t.description || "",
    ]);
  });
  
  const csv = rows.map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
  
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=transactions.csv");
  res.send(csv);
};
