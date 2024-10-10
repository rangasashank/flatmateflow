// routes/taskRoutes.js
import { Router } from 'express';
import { createTask, getTasks, updateTask, deleteTask, createRecurringTask, markTaskComplete } from '../controllers/taskController.js';
import { protect, protectGroup } from '../middleware/authMiddleware.js';
const router = Router();

// Task routes
router.post('/', protectGroup, createTask);  // Create a task
router.get('/:groupId', protectGroup, getTasks);  // Get tasks for a group
router.put('/:taskId', protectGroup, updateTask);  // Update a task
router.delete('/:taskId', protectGroup, deleteTask);  // Delete a task
router.post('/recurring-task', protectGroup, createRecurringTask);
router.put('/:taskId/complete', protectGroup, markTaskComplete);

export default router;