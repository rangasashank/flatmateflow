// routes/noteRoutes.js
import { Router } from 'express';
import { createNote, getNotes, deleteNote, pinNote } from '../controllers/noteController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = Router();

// Note routes
router.post('/', protect, createNote);  // Create a note
router.get('/:groupId', protect, getNotes);  // Get notes for a group
router.delete('/:noteId', protect, deleteNote);
router.post('/pin/:noteId', protect, pinNote)

export default router;