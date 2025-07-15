const Task = require('../models/Task');

// GET all tasks
const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET tasks by column
const getTasksByColumn = async (req, res) => {
    const { columnId } = req.params;
    try {
        const tasks = await Task.find({ column: columnId });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST create new task
const createTask = async (req, res) => {
    const newTask = new Task(req.body);
    try {
        const savedTask = await newTask.save();
        res.status(201).json(savedTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// PUT update task
const updateTask = async (req, res) => {
    const { id } = req.params;
    try {
        const updated = await Task.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// DELETE task
const deleteTask = async (req, res) => {
    const { id } = req.params;
    try {
        await Task.findByIdAndDelete(id);
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getAllTasks,
    getTasksByColumn,
    createTask,
    updateTask,
    deleteTask
};
