const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    due: String,
    assigned: [String], 
    comments: {
        type: Number,
        default: 0
    },
    attachments: {
        type: [String], 
        default: []
    },
    completed: {
        type: Boolean,
        default: false
    },
    column: {
        type: String,
        enum: ['backlog', 'todo', 'in-progress', 'review', 'done'],
        default: 'backlog'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Task', taskSchema);
