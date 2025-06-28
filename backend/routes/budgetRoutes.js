const express = require('express');
const router = express.Router();
const { createBudget, getBudgets, updateCategorySpent, archiveBudget, editBudget, getCategories,getBudgetReport } = require('../controllers/budgetController');
const authenticateToken = require('../Middleware/authMiddleware')
router.get('/', getBudgets);
const verifyToken = require('../Middleware/authenticateToken')

router.post('/create', createBudget);


router.put('/category/spent', updateCategorySpent);

router.put('/archive/:budgetId', archiveBudget);
router.put('/edit/:budgetId', editBudget);
router.get('/categories', getCategories);
router.get('/report/aggregate', getBudgetReport)
const categoryController = require('../controllers/categoryController');
const budgetController = require('../controllers/budgetController');
// const { verifyToken } = require('../Middleware/authenticateToken');
// const authenticateToken = require('../Middleware/authMiddleware');


router.get('/categorie', categoryController.getAll);
router.post('/categories', categoryController.create);
router.delete('/categories/:id', categoryController.delete);
router.post('/budget/expense-created', budgetController.handleExpenseCreated);
router.post('/category/spent', budgetController.updateCategorySpent);


module.exports = router;
