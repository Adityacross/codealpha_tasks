const express = require('express');
const router = express.Router();
const {
    getAllTasks,
    getTasksByColumn,
    createTask,
    updateTask,
    deleteTask
} = require('../controllers/taskController');

const authenticateToken = require('../middleware/authMiddleware');

router.get('/', getAllTasks);
router.get('/column/:columnId', getTasksByColumn);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);


router.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Protected route accessed', user: req.user });
});

module.exports = router;
