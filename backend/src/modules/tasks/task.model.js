const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    projectId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Project',
        required: true 
    },
    title: { type: String, required: true },
    description: { type: String },
    user_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['todo', 'in-progress', 'done'], 
        default: 'todo' 
    },
    priority: { 
        type: String, 
        enum: ['low', 'medium', 'high'], 
        default: 'medium' 
    },
    dueDate: { type: Date },
    estimatedHours: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);