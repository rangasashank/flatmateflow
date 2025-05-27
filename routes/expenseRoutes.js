import { Router } from 'express';
import { createExpense, deleteExpense, getExpenses, getGroupBalances } from '../controllers/expenseController.js'; // Import getGroupBalances
import { protect } from '../middleware/authMiddleware.js';
const router = Router();

// Expense routes
router.post('/', protect, createExpense);  // Create an expense
router.get('/:groupId', protect, getExpenses);  // Get expenses for a group
router.delete('/:expenseId', protect, deleteExpense);
router.get('/balances/:groupId', protect, getGroupBalances); // New route for group balances

export default router;