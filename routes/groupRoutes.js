import { Router } from 'express';
import { createGroup, addMember, removeMember, deleteGroup, joinGroup, getMembers } from '../controllers/groupController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = Router();
//add all the group routes like create, delete, add member, remove member etc
router.get('/:groupId', protect, getMembers);
router.post('/creategroup', protect, createGroup);
router.post('/deletegroup', protect, deleteGroup);
router.post('/addmember', protect, addMember);
router.post('/join', protect, joinGroup);
router.post('/removemember', protect, removeMember);


export default router;