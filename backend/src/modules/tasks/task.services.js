const Task = require('./task.model');

exports.createTask = async (data, userId) => {
    
    return await Task.create({ ...data, user_id: userId });
};

exports.getAllTasks = async (userId) => {
    return await Task.find({ user_id: userId }).populate('projectId', 'name');
};

exports.updateTask = async (id, data, userId) => {
    return await Task.findOneAndUpdate(
        { _id: id, user_id: userId },
        data,
        { new: true }
    );
};

exports.deleteTask = async (id, userId) => {
    return await Task.findOneAndDelete({ _id: id, user_id: userId });
};