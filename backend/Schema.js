
//  Schema.js - Joi Validation Schemas
const Joi = require("joi");

// ** Transaction Schema **
module.exports.transactionSchema = Joi.object({
  transaction: Joi.object({
    title: Joi.string().required(),
    amount: Joi.number().positive().required(),
    type: Joi.string().valid("income", "expense").required(),
    category: Joi.string().required(),
    date: Joi.date().required(),
    description: Joi.string().allow("", null),
    tags: Joi.array().items(Joi.string()),
  }).required(),
});

// ** Category Schema **
module.exports.categorySchema = Joi.object({
  category: Joi.object({
    name: Joi.string().required(),
    type: Joi.string().valid("income", "expense", "both").required(),
    color: Joi.string().allow("", null),
    icon: Joi.string().allow("", null),
  }).required(),
});

// ** User Signup Schema **
module.exports.userSignupSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("user", "admin").default("user"),
});
