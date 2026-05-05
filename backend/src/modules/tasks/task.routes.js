const express = require('express');
const router = express.Router();
const taskController = require('./task.controller');
const auth = require('../../middleware/auth.middleware');

router.get('/', auth, taskController.getTasks);
router.post('/', auth, taskController.addTask);


router.put('/:id', auth, taskController.modifyTask);

router.delete('/:id', auth, taskController.removeTask);

module.exports = router;