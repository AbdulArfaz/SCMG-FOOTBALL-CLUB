import express from 'express';
import Player from '../models/Player.js';

const router = express.Router();

// Get all players
router.get('/', async (req, res) => {
  try {
    const players = await Player.find().sort({ name: 1 });
    res.json(players);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a player (Admin)
router.post('/', async (req, res) => {
  try {
    const newPlayer = new Player(req.body);
    const savedPlayer = await newPlayer.save();
    res.status(201).json(savedPlayer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a player (Admin)
router.delete('/:id', async (req, res) => {
  try {
    await Player.findByIdAndDelete(req.params.id);
    res.json({ message: 'Player deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Update a player (Admin)
router.put('/:id', async (req, res) => {
  try {
    const updatedPlayer = await Player.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name, role: req.body.role },
      { new: true }
    );
    res.json(updatedPlayer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;