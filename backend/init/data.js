
//  init/data.js
 
const defaultCategories = [
  // Income categories
  { name: "Salary", type: "income", color: "#22c55e", icon: "💼", isDefault: true },
  { name: "Freelance", type: "income", color: "#16a34a", icon: "💻", isDefault: true },
  { name: "Investment", type: "income", color: "#15803d", icon: "📈", isDefault: true },
  { name: "Business", type: "income", color: "#166534", icon: "🏢", isDefault: true },
  { name: "Gift", type: "income", color: "#4ade80", icon: "🎁", isDefault: true },

  // Expense categories
  { name: "Food & Dining", type: "expense", color: "#ef4444", icon: "🍔", isDefault: true },
  { name: "Transportation", type: "expense", color: "#f97316", icon: "🚗", isDefault: true },
  { name: "Shopping", type: "expense", color: "#eab308", icon: "🛒", isDefault: true },
  { name: "Utilities", type: "expense", color: "#8b5cf6", icon: "💡", isDefault: true },
  { name: "Entertainment", type: "expense", color: "#ec4899", icon: "🎬", isDefault: true },
  { name: "Healthcare", type: "expense", color: "#06b6d4", icon: "🏥", isDefault: true },
  { name: "Education", type: "expense", color: "#3b82f6", icon: "📚", isDefault: true },
  { name: "Rent", type: "expense", color: "#6366f1", icon: "🏠", isDefault: true },
  { name: "Insurance", type: "expense", color: "#14b8a6", icon: "🛡️", isDefault: true },
  { name: "Other", type: "both", color: "#94a3b8", icon: "📦", isDefault: true },
];

module.exports = { defaultCategories };
