const express = require('express');
const router = express.Router();
const noteController = require('./note.controller');
const auth = require('../../middleware/auth.middleware');

router.use(auth);

router.get('/', noteController.getNotes); 

router.post('/', noteController.addNote); 

router.put('/:id', noteController.updateNote);

router.get('/project/:projectId', noteController.getProjectNotes);

router.delete('/:id', noteController.removeNote);

module.exports = router;