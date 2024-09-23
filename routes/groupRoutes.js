const express = require('express');
const { createGroup } = require('../controllers/groupController');
const router = express.Router();
//add all the group routes like create, delete, add member, remove member etc
router.post('/create', createGroup);

module.exports = router;