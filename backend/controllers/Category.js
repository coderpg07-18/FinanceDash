
//  Category

const Category = require("../models/Category");
const ExpressError = require("../utils/ExpressError");

//nGET /api/categories
module.exports.index = async (req, res) => {
  // Return system defaults + user's own categories
  const categories = await Category.find({
    $or: [{ isDefault: true }, { owner: req.user._id }],
  });
  
  res.json({ success: true, categories });
};


// POST /api/categories (create) 
module.exports.create = async (req, res, next) => {
  const category = new Category({ ...req.body, owner: req.user._id });
  
  await category.save();
  
  res.status(201).json({ success: true, message: "Category created!", category });
};


// PUT /api/categories/:id (update)
module.exports.update = async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  
  if (!category) return next(new ExpressError(404, "Category not found"));
  
  if (category.isDefault && req.user.role !== "admin") {
    return next(new ExpressError(403, "Cannot edit default categories"));
  }
  const updated = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  
  res.json({ success: true, message: "Category updated!", category: updated });
};


// DELETE /api/categories/:id (destroy)
module.exports.destroy = async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) return next(new ExpressError(404, "Category not found"));

  if (category.isDefault && req.user.role !== "admin") {
    return next(new ExpressError(403, "Cannot delete default categories"));
  }

  await Category.findByIdAndDelete(req.params.id);

  res.json({ success: true, message: "Category deleted!" });
};
