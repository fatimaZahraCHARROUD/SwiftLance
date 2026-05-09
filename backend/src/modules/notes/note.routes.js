const express = require('express');
const router = express.Router();
const noteController = require('./note.controller');
const auth = require('../../middleware/auth.middleware');

router.use(auth);

// --- ZIDI HAD L-STER (Hwa li khass l-Frontend dyalk) ---
router.get('/', noteController.getNotes); 

// Hadu dyalk li kanti dayra
router.post('/', noteController.addNote);
router.get('/project/:projectId', noteController.getProjectNotes);
router.delete('/:id', noteController.removeNote);

module.exports = router;