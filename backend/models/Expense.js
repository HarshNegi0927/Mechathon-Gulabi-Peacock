
const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  description: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  budgetId:{type:mongoose.Schema.Types.ObjectId,ref:'Budget'}
  
}, { timestamps: true });

module.exports = mongoose.model('Expense', ExpenseSchema);