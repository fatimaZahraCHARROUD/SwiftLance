const taskService = require('./task.services');

exports.addTask = async (req, res) => {
    try {
        // req.user.id jay mn l-auth middleware
        const newTask = await taskService.createTask(req.body, req.user.id);
        res.status(201).json(newTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getTasks = async (req, res) => {
    try {
        const tasks = await taskService.getAllTasks(req.user.id);
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.modifyTask = async (req, res) => {
    try {
        // Passi l-ID dyal task, l-data l-jdida, o l-user_id dyal li m-connecti
        const updatedTask = await taskService.updateTask(req.params.id, req.body, req.user.id);
        
        if (!updatedTask) {
            return res.status(404).json({ message: "Tâche non trouvée ou vous n'avez pas l'autorisation" });
        }
        
        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.removeTask = async (req, res) => {
    try {
        // Kandiro l-misme chose hna bach n-t2kdou belli user kiy-msey ghir tasks dyalo
        const deletedTask = await taskService.deleteTask(req.params.id, req.user.id);
        
        if (!deletedTask) {
            return res.status(404).json({ message: "Tâche non trouvée ou vous n'avez pas l'autorisation" });
        }
        
        res.status(200).json({ message: "Tâche supprimée avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};