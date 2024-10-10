// routes/expenseRoutes.js
import { Router } from 'express';
import { createExpense, deleteExpense, getExpenses } from '../controllers/expenseController.js';
import { protect, protectGroup } from '../middleware/authMiddleware.js';
const router = Router();

// Expense routes
router.post('/', protectGroup, createExpense);  // Create an expense
router.get('/:groupId', protectGroup, getExpenses);  // Get expenses for a group
router.delete('/:expenseId', protectGroup, deleteExpense);

export default router;