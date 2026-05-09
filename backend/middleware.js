
//  middleware.js - isLoggedIn, isOwner, validateListing
//  JWT, + role-based access

const jwt = require("jsonwebtoken");
const ExpressError = require("./utils/ExpressError");
const Transaction = require("./models/Transaction");
const { transactionSchema, categorySchema } = require("./Schema");


// ** isLoggedIn **
module.exports.isLoggedIn = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new ExpressError(401, "You must be logged in!"));
  }
  
  const token = authHeader.split(" ")[1];
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { _id, username, email, role }
    next();
  } catch (err) {
    return next(new ExpressError(401, "Invalid or expired token!"));
  }
};

// ** isAdmin **
module.exports.isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return next(new ExpressError(403, "Access denied. Admins only!"));
  }
  next();
};

// ** */ isOwner **
// Checks if logged-in user owns the transaction
module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  
  const transaction = await Transaction.findById(id);
  
  if (!transaction) return next(new ExpressError(404, "Transaction not found"));
  
  if (
    !transaction.owner.equals(req.user._id) &&
    req.user.role !== "admin"
  ) {
    return next(new ExpressError(403, "You don't have permission to do that!"));
  }
  next();
};


// ** validateTransaction **
module.exports.validateTransaction = (req, res, next) => {
  const { error } = transactionSchema.validate({ transaction: req.body });
  
  if (error) {
    const msg = error.details.map((el) => el.message).join(", ");
    return next(new ExpressError(400, msg));
  }
  next();
};


// ** validateCategory **
module.exports.validateCategory = (req, res, next) => {
  const { error } = categorySchema.validate({ category: req.body });
  
  if (error) {
    const msg = error.details.map((el) => el.message).join(", ");
    return next(new ExpressError(400, msg));
  }
  next();
};
