// routes/taskRoutes.js
import { Router } from 'express';
import { createTask, getTasks, updateTask, deleteTask, createRecurringTask, markTaskComplete } from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = Router();

// Task routes
router.post('/', protect, createTask);  // Create a task
router.get('/:groupId', protect, getTasks);  // Get tasks for a group
router.put('/:taskId', protect, updateTask);  // Update a task
router.delete('/:taskId', protect, deleteTask);  // Delete a task
router.post('/recurring-task', protect, createRecurringTask);
router.put('/:taskId/complete', protect, markTaskComplete);

export default router;