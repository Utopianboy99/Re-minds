const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Task = require('../models/Task');

// @route   POST /api/tasks
// @desc    Create a task (protected)
// @access  Private
router.post('/', auth, async (req, res) => {
    const { title, description } = req.body;

    try {
        const task = new Task({
            user: req.user,
            title,
            description
        });

        await task.save();
        res.status(201).json(task);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
});

// @route   GET /api/tasks
// @desc    Get all tasks for logged-in user
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user }).sort({ createdAt: -1 });
        res.json(tasks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;

// @route   PUT /api/tasks/:id
// @desc    Update a task by ID (only if user owns it)
// @access  Private
router.put('/:id', auth, async (req, res) => {
    const { title, description } = req.body;

    try {
        let task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ msg: 'Task not found' });
        }

        // Make sure user owns the task
        if (task.user.toString() !== req.user) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        task.title = title || task.title;
        task.description = description || task.description;

        await task.save();

        res.json(task);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete a task by ID (only if user owns it)
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ msg: 'Task not found' });
        }

        // Check task ownership
        if (task.user.toString() !== req.user) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await task.remove();
        res.json({ msg: 'Task deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
});
