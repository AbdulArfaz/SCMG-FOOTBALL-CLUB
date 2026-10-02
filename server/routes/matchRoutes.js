import express from 'express';
import Match from '../models/Match.js';
import MatchParticipation from '../models/MatchParticipation.js';

const router = express.Router();

// Get all matches (for daily score logs)
router.get('/', async (req, res) => {
  try {
    const matches = await Match.find().sort({ date: -1 });
    res.json(matches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Record a daily match and individual player performances (Admin)
router.post('/', async (req, res) => {
  try {
    const { date, teamAScore, teamBScore, participations } = req.body; 
    // participations is an array of objects: 
    // [{ player: playerId, team: 'A'/'B', goals: 2, tackles: 3, assists: 1, won: true }]

    // 1. Create the Match session
    const newMatch = new Match({
      date: date || Date.now(),
      teamAScore,
      teamBScore
    });
    const savedMatch = await newMatch.save();

    // 2. Save each player's participation records linked to this match
    if (participations && participations.length > 0) {
      const participationDocs = participations.map(p => ({
        match: savedMatch._id,
        player: p.player,
        team: p.team,
        goals: p.goals || 0,
        tackles: p.tackles || 0,
        assists: p.assists || 0,
        won: p.won
      }));
      await MatchParticipation.insertMany(participationDocs);
    }

    res.status(201).json({ message: 'Match and stats recorded successfully!', match: savedMatch });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;