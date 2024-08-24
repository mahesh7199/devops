const mongoose = require('mongoose');
const TaskSchema = new mongoose.Schema({
    task: String,
    userStoryId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'UserStory' // Ensure this matches your User Story model name
    },
    taskDescription: {
        type: String,
        required: true},
    createdBy: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' // Ensure this matches your User model name
    },
    status: {
        type: String,
        enum: ['New', 'In Progress', 'Awaiting Confirmation', 'Completed'],
        default: 'New'
    }
});

const Task = mongoose.model("Task", TaskSchema);
module.exports = Task;
