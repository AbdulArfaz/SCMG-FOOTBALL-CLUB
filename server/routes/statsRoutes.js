import express from 'express';
import MatchParticipation from '../models/MatchParticipation.js';

const router = express.Router();

router.get('/leaderboard', async (req, res) => {
  try {
    const { month } = req.query; // format: 'YYYY-MM'
    const startDate = new Date(`${month}-01T00:00:00.000Z`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    const topScorers = await MatchParticipation.aggregate([
      { $lookup: { from: 'matches', localField: 'match', foreignField: '_id', as: 'matchInfo' } },
      { $unwind: '$matchInfo' },
      { $match: { 'matchInfo.date': { $gte: startDate,$lt: endDate } } },
      { $group: { _id: '$player', totalGoals: { $sum: '$goals' } } },
      { $sort: { totalGoals: -1 } },
      { $limit: 5 },       {$lookup: { from: 'players', localField: '_id', foreignField: '_id', as: 'playerDetails' } },
      { $unwind: '$playerDetails' }
    ]);

    const topDefenders = await MatchParticipation.aggregate([
      { $lookup: { from: 'matches', localField: 'match', foreignField: '_id', as: 'matchInfo' } },
      { $unwind: '$matchInfo' },
      { $match: { 'matchInfo.date': { $gte: startDate,$lt: endDate } } },
      { $group: { _id: '$player', totalTackles: { $sum: '$tackles' } } },
      { $sort: { totalTackles: -1 } },
      { $limit: 5 },       {$lookup: { from: 'players', localField: '_id', foreignField: '_id', as: 'playerDetails' } },
      { $unwind: '$playerDetails' }
    ]);

    const mostWins = await MatchParticipation.aggregate([
      { $lookup: { from: 'matches', localField: 'match', foreignField: '_id', as: 'matchInfo' } },
      { $unwind: '$matchInfo' },
      { $match: { 'matchInfo.date': { $gte: startDate,$lt: endDate }, won: true } },
      { $group: { _id: '$player', totalWins: { $sum: 1 } } },       {$sort: { totalWins: -1 } },
      { $limit: 5 },       {$lookup: { from: 'players', localField: '_id', foreignField: '_id', as: 'playerDetails' } },
      { $unwind: '$playerDetails' }
    ]);

    res.json({ topScorers, topDefenders, mostWins });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;