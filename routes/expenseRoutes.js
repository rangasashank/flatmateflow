// routes/expenseRoutes.js
import { Router } from 'express';
import { createExpense, deleteExpense, getExpenses } from '../controllers/expenseController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = Router();

// Expense routes
router.post('/', protect, createExpense);  // Create an expense
router.get('/:groupId', protect, getExpenses);  // Get expenses for a group
router.delete('/:expenseId', protect, deleteExpense);

export default router;