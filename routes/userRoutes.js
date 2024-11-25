import { Router } from 'express';
import { register, login, logout, deleteUser, getUserProfile } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = Router();

// create all routes like register, login, logout, delete, update user etc

router.post('/register', register);
router.get('/profile', protect, getUserProfile);
router.post('/login', login);
router.post('/logout', protect, logout);
router.post('/deleteUser', protect, deleteUser);


export default router;