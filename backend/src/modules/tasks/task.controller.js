const taskService = require('./task.services');

exports.addTask = async (req, res) => {
    try {
        // On injecte l'user_id provenant du token JWT (middleware d'auth)
        const taskData = { ...req.body, user_id: req.user.id };
        const task = await taskService.createTask(taskData);
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la création de la tâche", error: error.message });
    }
};

exports.getProjectTasks = async (req, res) => {
    try {
        const tasks = await taskService.getTasksByProject(req.params.projectId, req.user.id);
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Erreur de récupération", error: error.message });
    }
};

exports.updateTaskInfo = async (req, res) => {
    try {
        const updatedTask = await taskService.updateTask(req.params.id, req.user.id, req.body);
        if (!updatedTask) return res.status(404).json({ message: "Tâche introuvable" });
        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: "Erreur de mise à jour", error: error.message });
    }
};

exports.removeTask = async (req, res) => {
    try {
        const result = await taskService.deleteTask(req.params.id, req.user.id);
        if (!result) return res.status(404).json({ message: "Tâche introuvable" });
        res.status(200).json({ message: "Tâche supprimée" });
    } catch (error) {
        res.status(500).json({ message: "Erreur de suppression", error: error.message });
    }
};