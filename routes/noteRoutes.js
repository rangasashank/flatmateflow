// routes/noteRoutes.js
import { Router } from 'express';
import { createNote, getNotes, deleteNote } from '../controllers/noteController.js';
import { protect, protectGroup } from '../middleware/authMiddleware.js';
const router = Router();

// Note routes
router.post('/', protectGroup, createNote);  // Create a note
router.get('/:groupId', protectGroup, getNotes);  // Get notes for a group
router.delete('/:noteId', protectGroup, deleteNote);

export default router;