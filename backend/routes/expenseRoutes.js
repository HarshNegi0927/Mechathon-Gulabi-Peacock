const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');

router.get('/categories', expenseController.getCategories);
router.get('/expenses/:budgetId', expenseController.getExpenses);
router.post('/addExpenses', expenseController.addExpense);
router.delete('/expenses/:id', expenseController.deleteExpense);

module.exports = router;