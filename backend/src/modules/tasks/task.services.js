const Task = require('./task.model');

// Créer une nouvelle tâche
exports.createTask = async (taskData) => {
    const task = new Task(taskData);
    return await task.save();
};

// Récupérer les tâches d'un projet spécifique pour un utilisateur donné
exports.getTasksByProject = async (projectId, userId) => {
    return await Task.find({ projectId, user_id: userId });
};

// Mettre à jour une tâche (ex: changer le statut ou les heures estimées)
exports.updateTask = async (taskId, userId, updateData) => {
    return await Task.findOneAndUpdate(
        { _id: taskId, user_id: userId },
        updateData,
        { new: true }
    );
};

// Supprimer une tâche
exports.deleteTask = async (taskId, userId) => {
    return await Task.findOneAndDelete({ _id: taskId, user_id: userId });
};