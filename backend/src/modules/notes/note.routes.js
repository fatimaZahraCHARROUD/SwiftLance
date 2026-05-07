const express = require('express');
const router = express.Router();
const noteController = require('./note.controller');
const auth = require('../../middleware/auth.middleware');

// Toutes les notes nécessitent d'être connecté
router.use(auth);

// POST: Ajouter une note (doit contenir projectId, title, content dans le body)
router.post('/', noteController.addNote);

// GET: Récupérer les notes d'un projet (ex: /api/notes/project/ID_DU_PROJET)
router.get('/project/:projectId', noteController.getProjectNotes);

// DELETE: Supprimer une note par son ID
router.delete('/:id', noteController.removeNote);

module.exports = router;