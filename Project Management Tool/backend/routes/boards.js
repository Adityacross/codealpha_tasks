const express = require('express');
const router = express.Router();
const Board = require('../models/Board');

// POST: Create a new board
router.post('/', async (req, res) => {
  const { name, columnId, type } = req.body;

  if (!name || !columnId || !type) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const existing = await Board.findOne({ columnId, type });
    if (existing) {
      return res.status(409).json({ message: 'Board already exists' });
    }

    const board = new Board({ name, columnId, type });
    await board.save();
    return res.status(201).json({
      message: 'Board created successfully',
      board
    });
  } catch (err) {
    console.error('Error creating board:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// GET: Get all boards
router.get('/', async (req, res) => {
  try {
    const boards = await Board.find();
    res.json(boards);
  } catch (err) {
    console.error('Error fetching boards:', err);
    res.status(500).json({ message: 'Error fetching boards' });
  }
});

// GET: Get boards by type (team or personal)
router.get('/:type', async (req, res) => {
  const { type } = req.params;
  try {
    const boards = await Board.find({ type });
    res.json(boards);
  } catch (err) {
    console.error('Error fetching boards by type:', err);
    res.status(500).json({ message: 'Error fetching boards by type' });
  }
});

// DELETE: Delete all boards by type (reset)
router.delete('/:type', async (req, res) => {
  const { type } = req.params;
  try {
    await Board.deleteMany({ type });
    res.json({ message: `All ${type} boards deleted.` });
  } catch (err) {
    console.error('Error deleting boards:', err);
    res.status(500).json({ message: 'Error deleting boards' });
  }
});

module.exports = router;
