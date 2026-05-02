const express = require('express');
const router = express.Router();
const taskController = require('./task.controller');
const auth = require('../../middleware/auth.middleware');

// Sécurité : Toutes les routes nécessitent une authentification
router.use(auth);

// Créer une tâche
router.post('/', taskController.addTask);

// Récupérer toutes les tâches d'un projet via son ID
router.get('/project/:projectId', taskController.getProjectTasks);

// Mettre à jour une tâche par son ID (PATCH ou PUT)
router.patch('/:id', taskController.updateTaskInfo);

// Supprimer une tâche
router.delete('/:id', taskController.removeTask);

module.exports = router;