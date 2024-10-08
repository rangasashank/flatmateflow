import { Router } from 'express';
import { register, login, logout, deleteUser } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = Router();

// create all routes like register, login, logout, delete, update user etc

router.post('/register', register);
router.post('/login', login);
router.get('/logout', protect, logout);
router.post('/deleteUser', protect, deleteUser);


export default router;