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

// Add a player (Admin) - Clean JSON without uploads
router.post('/', async (req, res) => {
  try {
    const { name, role, age } = req.body;

    const newPlayer = new Player({
      name,
      role,
      age: age ? Number(age) : undefined,
    });

    const savedPlayer = await newPlayer.save();
    res.status(201).json(savedPlayer);
  } catch (err) {
    console.log("ADD PLAYER ERROR:", err.message);
    res.status(400).json({ error: err.message });
  }
});

// Update a player (Admin) - Clean JSON without uploads
router.put('/:id', async (req, res) => {
  try {
    const { name, role, age } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (role) updateData.role = role;
    if (age !== undefined) updateData.age = age ? Number(age) : null;

    const updatedPlayer = await Player.findByIdAndUpdate(
      req.params.id,
      updateData,
      { returnDocument: after }
    );

    if (!updatedPlayer) {
      return res.status(404).json({ error: "Player not found" });
    }

    res.json(updatedPlayer);
  } catch (err) {
    console.log("UPDATE PLAYER ERROR:", err.message);
    res.status(400).json({ error: err.message });
  }
});

// Delete a player (Admin)
router.delete('/:id', async (req, res) => {
  try {
    const deletedPlayer = await Player.findByIdAndDelete(req.params.id);
    if (!deletedPlayer) {
      return res.status(404).json({ error: "Player not found" });
    }
    res.json({ message: "Player deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;