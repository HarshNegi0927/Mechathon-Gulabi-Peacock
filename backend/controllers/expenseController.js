// controllers/expenseController.js
const Expense = require('../models/Expense');
const Category = require('../models/category');

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ userId: req.user._id });
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
};

exports.getExpenses = async (req, res) => {
  const { budgetId } = req.params;

  try {
    const expenses = await Expense.find({ budgetId }).sort({ date: -1 });
    const totalAmount = expenses.reduce((total, expense) => total + expense.amount, 0);
    res.status(200).json({ expenses, total: totalAmount });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ message: 'Failed to fetch expenses' });
  }
};

exports.addExpense = async (req, res) => {
  const { description, amount, category, date,budgetId } = req.body;
  

  if (!description || !amount || !category || !date) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newExpense = new Expense({ description, amount, category, date, userId: req.user._id,budgetId:budgetId});
    await newExpense.save();
    res.status(201).json({ message: 'Expense added successfully', expense: newExpense });
  } catch (error) {
    console.error('Error adding expense:', error);
    res.status(500).json({ message: 'Failed to add expense' });
  }
};

exports.deleteExpense = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  try {
    const deletedExpense = await Expense.findOneAndDelete({ _id: id, userId });
    if (!deletedExpense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ message: 'Failed to delete expense' });
  }
};