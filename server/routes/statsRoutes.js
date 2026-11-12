import express from 'express';
import Match from '../models/Match.js';

const router = express.Router();

router.get('/leaderboard', async (req, res) => {
  try {
    const { month } = req.query;

    // Validate month format
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month || '')) {
      return res.status(400).json({
        error: 'Invalid month format. Use YYYY-MM'
      });
    }

    const startDate = new Date(`${month}-01T00:00:00.000Z`);
    const endDate = new Date(startDate);
    endDate.setUTCMonth(endDate.getUTCMonth() + 1);

    const stats = await Match.aggregate([
      // 1. Filter matches by month first
      {
        $match: {
          date: {
            $gte: startDate,
            $lt: endDate
          }
        }
      },

      // 2. Get participation records
      {
        $lookup: {
          from: 'matchparticipations',
          localField: '_id',
          foreignField: 'match',
          as: 'participations'
        }
      },

      { $unwind: '$participations' },

      // 3. Calculate all statistics together
      {
        $group: {
          _id: '$participations.player',

          totalGoals: {
            $sum: '$participations.goals'
          },

          totalTackles: {
            $sum: '$participations.tackles'
          },

          totalWins: {
            $sum: {
              $cond: [
                { $eq: ['$participations.won', true] },
                1,
                0
              ]
            }
          }
        }
      },

      // 4. Get player details
      {
        $lookup: {
          from: 'players',
          localField: '_id',
          foreignField: '_id',
          as: 'playerDetails'
        }
      },

      { $unwind: '$playerDetails' }
    ]);

    // Prepare three separate leaderboards
    const topScorers = [...stats]
      .sort((a, b) => b.totalGoals - a.totalGoals)
      .map(({ _id, totalGoals, playerDetails }) => ({
        _id,
        totalGoals,
        playerDetails
      }));

    const topDefenders = [...stats]
      .sort((a, b) => b.totalTackles - a.totalTackles)
      .map(({ _id, totalTackles, playerDetails }) => ({
        _id,
        totalTackles,
        playerDetails
      }));

    const mostWins = [...stats]
      .sort((a, b) => b.totalWins - a.totalWins)
      .map(({ _id, totalWins, playerDetails }) => ({
        _id,
        totalWins,
        playerDetails
      }));

    res.json({
      topScorers,
      topDefenders,
      mostWins
    });

  } catch (err) {
    console.error('Leaderboard error:', err);

    res.status(500).json({
      error: err.message
    });
  }
});

export default router;