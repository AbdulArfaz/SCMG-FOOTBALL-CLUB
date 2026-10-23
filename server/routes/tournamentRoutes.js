import express from "express";
import mongoose from "mongoose";
import Tournament from "../models/Tournament.js";
import TournamentTeam from "../models/TournamentTeam.js";
import TournamentMatch from "../models/TournamentMatch.js";
import Player from "../models/Player.js";

const router = express.Router();

/* =========================
   HELPER: CHECK PLAYER ASSIGNMENTS
========================= */

async function checkPlayerAvailability(
  tournamentId,
  playerIds,
  excludeTeamId = null
) {
  const uniquePlayerIds = [...new Set(playerIds.map(String))];

  if (uniquePlayerIds.length === 0) {
    return [];
  }

  const query = {
    tournament: tournamentId,
    players: { $in: uniquePlayerIds },
  };

  if (excludeTeamId) {
    query._id = { $ne: excludeTeamId };
  }

  const assignedTeams = await TournamentTeam.find(query).populate(
    "players",
    "name"
  );

  const unavailablePlayers = new Set();

  for (const team of assignedTeams) {
    for (const player of team.players) {
      if (uniquePlayerIds.includes(String(player._id))) {
        unavailablePlayers.add(player.name || String(player._id));
      }
    }
  }

  return [...unavailablePlayers];
}

/* =========================
   HELPER: VALIDATE MATCH PLAYER
========================= */

// A player must belong to one of the two teams
// participating in this particular match.
async function validateMatchPlayer(match, playerId) {
  if (!mongoose.isValidObjectId(playerId)) {
    return { valid: false, message: "Invalid player ID" };
  }

  const player = await Player.findById(playerId).select("_id");

  if (!player) {
    return { valid: false, message: "Selected player does not exist" };
  }

  const team = await TournamentTeam.findOne({
    tournament: match.tournament,
    _id: { $in: [match.teamA, match.teamB] },
    players: player._id,
  }).select("_id");

  if (!team) {
    return {
      valid: false,
      message: "Selected player must belong to one of the teams in this match",
    };
  }

  return { valid: true, teamId: String(team._id) };
}

/* =========================
   HELPER: POPULATE MATCH
========================= */

function populateMatch(query) {
  return query
    .populate("teamA", "name logo")
    .populate("teamB", "name logo")
    .populate("winner", "name logo")
    .populate("bestDefender", "name avatar")
    .populate("goalScorers.player", "name avatar")
    .populate("goalScorers.team", "name logo");
}

/* =========================
   GET ALL TOURNAMENTS
========================= */

router.get("/", async (req, res) => {
  try {
    const tournaments = await Tournament.find()
      .populate("winner", "name")
      .populate("bestScorer", "name")
      .populate("bestDefender", "name")
      .populate("bestPlayer", "name")
      .sort({ startDate: -1 });

    res.json(tournaments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   GET ONE TOURNAMENT
   WITH TEAMS AND MATCHES
========================= */

router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Invalid tournament ID" });
    }

    const tournament = await Tournament.findById(req.params.id)
      .populate("winner", "name")
      .populate("bestScorer", "name")
      .populate("bestDefender", "name")
      .populate("bestPlayer", "name");

    if (!tournament) {
      return res.status(404).json({
        error: "Tournament not found",
      });
    }

    const teams = await TournamentTeam.find({
      tournament: tournament._id,
    }).populate("players", "name role avatar");

    const matches = await populateMatch(
      TournamentMatch.find({ tournament: tournament._id })
    ).sort({ matchNumber: 1 });

    res.json({
      tournament,
      teams,
      matches,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   CREATE TOURNAMENT
========================= */

router.post("/", async (req, res) => {
  try {
    const {
      name,
      description,
      startDate,
      endDate,
      venue,
      status,
    } = req.body;

    if (!name || !name.trim() || !startDate) {
      return res.status(400).json({
        error: "Tournament name and start date are required",
      });
    }

    const tournament = await Tournament.create({
      name: name.trim(),
      description,
      startDate,
      endDate,
      venue,
      status,
    });

    res.status(201).json({
      message: "Tournament created successfully",
      tournament,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* =========================
   UPDATE TOURNAMENT
========================= */

router.put("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Invalid tournament ID" });
    }

    const tournament = await Tournament.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!tournament) {
      return res.status(404).json({
        error: "Tournament not found",
      });
    }

    res.json({
      message: "Tournament updated successfully",
      tournament,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* =========================
   DELETE TOURNAMENT
   AND ITS TEAMS/MATCHES
========================= */

router.delete("/:id", async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);

    if (!tournament) {
      return res.status(404).json({
        error: "Tournament not found",
      });
    }

    await TournamentTeam.deleteMany({
      tournament: tournament._id,
    });

    await TournamentMatch.deleteMany({
      tournament: tournament._id,
    });

    await tournament.deleteOne();

    res.json({
      message: "Tournament deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   CREATE TOURNAMENT TEAM
========================= */

router.post("/:id/teams", async (req, res) => {
  try {
    const { name, players = [], logo = "" } = req.body;
    const tournamentId = req.params.id;

    if (!name || !name.trim()) {
      return res.status(400).json({
        error: "Team name is required",
      });
    }

    if (!Array.isArray(players)) {
      return res.status(400).json({
        error: "Players must be an array of Player IDs",
      });
    }

    const tournament = await Tournament.findById(tournamentId);

    if (!tournament) {
      return res.status(404).json({
        error: "Tournament not found",
      });
    }

    const uniquePlayers = [...new Set(players.map(String))];

    if (!uniquePlayers.every((id) => mongoose.isValidObjectId(id))) {
      return res.status(400).json({
        error: "One or more player IDs are invalid",
      });
    }

    const existingPlayers = await Player.find({
      _id: { $in: uniquePlayers },
    }).select("_id");

    if (existingPlayers.length !== uniquePlayers.length) {
      return res.status(400).json({
        error: "One or more selected players do not exist",
      });
    }

    const unavailablePlayers = await checkPlayerAvailability(
      tournamentId,
      uniquePlayers
    );

    if (unavailablePlayers.length > 0) {
      return res.status(409).json({
        error:
          "Some players are already assigned to another team in this tournament",
        players: unavailablePlayers,
      });
    }

    const team = await TournamentTeam.create({
      tournament: tournament._id,
      name: name.trim(),
      players: uniquePlayers,
      logo,
    });

    const populatedTeam = await TournamentTeam.findById(team._id).populate(
      "players",
      "name role avatar"
    );

    res.status(201).json({
      message: "Tournament team created successfully",
      team: populatedTeam,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        error: "A team with this name already exists in this tournament",
      });
    }

    res.status(400).json({ error: err.message });
  }
});

/* =========================
   UPDATE TOURNAMENT TEAM
========================= */

router.put("/:id/teams/:teamId", async (req, res) => {
  try {
    const { name, players, logo } = req.body;

    const tournament = await Tournament.findById(req.params.id);

    if (!tournament) {
      return res.status(404).json({
        error: "Tournament not found",
      });
    }

    const team = await TournamentTeam.findOne({
      _id: req.params.teamId,
      tournament: req.params.id,
    });

    if (!team) {
      return res.status(404).json({
        error: "Tournament team not found",
      });
    }

    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        return res.status(400).json({
          error: "Team name cannot be empty",
        });
      }

      team.name = name.trim();
    }

    if (players !== undefined) {
      if (!Array.isArray(players)) {
        return res.status(400).json({
          error: "Players must be an array of Player IDs",
        });
      }

      const uniquePlayers = [...new Set(players.map(String))];

      if (!uniquePlayers.every((id) => mongoose.isValidObjectId(id))) {
        return res.status(400).json({
          error: "One or more player IDs are invalid",
        });
      }

      const existingPlayers = await Player.find({
        _id: { $in: uniquePlayers },
      }).select("_id");

      if (existingPlayers.length !== uniquePlayers.length) {
        return res.status(400).json({
          error: "One or more selected players do not exist",
        });
      }

      const unavailablePlayers = await checkPlayerAvailability(
        req.params.id,
        uniquePlayers,
        team._id
      );

      if (unavailablePlayers.length > 0) {
        return res.status(409).json({
          error:
            "Some players are already assigned to another team in this tournament",
          players: unavailablePlayers,
        });
      }

      team.players = uniquePlayers;
    }

    if (logo !== undefined) {
      team.logo = logo;
    }

    await team.save();

    const populatedTeam = await TournamentTeam.findById(team._id).populate(
      "players",
      "name role avatar"
    );

    res.json({
      message: "Tournament team updated successfully",
      team: populatedTeam,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        error: "A team with this name already exists in this tournament",
      });
    }

    res.status(400).json({ error: err.message });
  }
});

/* =========================
   DELETE TOURNAMENT TEAM
========================= */

router.delete("/:id/teams/:teamId", async (req, res) => {
  try {
    const team = await TournamentTeam.findOne({
      _id: req.params.teamId,
      tournament: req.params.id,
    });

    if (!team) {
      return res.status(404).json({
        error: "Tournament team not found",
      });
    }

    const relatedMatch = await TournamentMatch.findOne({
      tournament: req.params.id,
      $or: [{ teamA: team._id }, { teamB: team._id }],
    });

    if (relatedMatch) {
      return res.status(409).json({
        error: "This team is already linked to a tournament match",
      });
    }

    await team.deleteOne();

    res.json({
      message: "Tournament team deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   CREATE TOURNAMENT MATCH
========================= */

router.post("/:id/matches", async (req, res) => {
  try {
    const { stage, matchNumber, teamA, teamB, date } = req.body;

    const tournament = await Tournament.findById(req.params.id);

    if (!tournament) {
      return res.status(404).json({
        message: "Tournament not found",
      });
    }

    if (
      !stage ||
      !Number.isInteger(Number(matchNumber)) ||
      Number(matchNumber) < 1 ||
      !teamA ||
      !teamB
    ) {
      return res.status(400).json({
        message:
          "A valid stage, match number, team A and team B are required",
      });
    }

    if (
      !mongoose.isValidObjectId(teamA) ||
      !mongoose.isValidObjectId(teamB)
    ) {
      return res.status(400).json({
        message: "Invalid team ID",
      });
    }

    if (String(teamA) === String(teamB)) {
      return res.status(400).json({
        message: "Both teams cannot be the same",
      });
    }

    const teams = await TournamentTeam.find({
      _id: { $in: [teamA, teamB] },
      tournament: req.params.id,
    });

    if (teams.length !== 2) {
      return res.status(400).json({
        message: "Both teams must belong to this tournament",
      });
    }

    const match = await TournamentMatch.create({
      tournament: req.params.id,
      stage,
      matchNumber: Number(matchNumber),
      teamA,
      teamB,
      date: date || new Date(),
    });

    const populatedMatch = await populateMatch(
      TournamentMatch.findById(match._id)
    );

    res.status(201).json({
      message: "Tournament match created successfully",
      match: populatedMatch,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

/* =========================
   UPDATE TOURNAMENT MATCH
   SCORE, GOAL SCORERS,
   BEST DEFENDER AND STATUS
========================= */

router.put("/:id/matches/:matchId", async (req, res) => {
  try {
    const {
      teamAScore,
      teamBScore,
      goalScorers,
      bestDefender,
      status,
      summary,
    } = req.body;

    const match = await TournamentMatch.findOne({
      _id: req.params.matchId,
      tournament: req.params.id,
    });

    if (!match) {
      return res.status(404).json({
        message: "Tournament match not found",
      });
    }

    // Validate and update scores.
    if (teamAScore !== undefined) {
      if (!Number.isInteger(teamAScore) || teamAScore < 0) {
        return res.status(400).json({
          message: "Team A score must be a non-negative integer",
        });
      }

      match.teamAScore = teamAScore;
    }

    if (teamBScore !== undefined) {
      if (!Number.isInteger(teamBScore) || teamBScore < 0) {
        return res.status(400).json({
          message: "Team B score must be a non-negative integer",
        });
      }

      match.teamBScore = teamBScore;
    }

    // Validate each goal scorer and their team.
    if (goalScorers !== undefined) {
      if (!Array.isArray(goalScorers)) {
        return res.status(400).json({
          message: "Goal scorers must be an array",
        });
      }

      const validatedScorers = [];

      for (const scorer of goalScorers) {
        if (
          !scorer ||
          !scorer.player ||
          !scorer.team ||
          !Number.isInteger(scorer.goals) ||
          scorer.goals < 1
        ) {
          return res.status(400).json({
            message:
              "Each goal scorer must include a valid player, team and positive integer goal count",
          });
        }

        if (
          !mongoose.isValidObjectId(scorer.team) ||
          ![String(match.teamA), String(match.teamB)].includes(
            String(scorer.team)
          )
        ) {
          return res.status(400).json({
            message: "Goal scorer team must be one of the teams in this match",
          });
        }

        const playerValidation = await validateMatchPlayer(
          match,
          scorer.player
        );

        if (!playerValidation.valid) {
          return res.status(400).json({
            message: playerValidation.message,
          });
        }

        if (playerValidation.teamId !== String(scorer.team)) {
          return res.status(400).json({
            message:
              "The goal scorer's selected team does not match their assigned team",
          });
        }

        validatedScorers.push({
          player: scorer.player,
          team: scorer.team,
          goals: scorer.goals,
        });
      }

      match.goalScorers = validatedScorers;
    }

    // Validate the best defender for this match.
    if (bestDefender !== undefined) {
      if (bestDefender === null || bestDefender === "") {
        match.bestDefender = null;
      } else {
        const defenderValidation = await validateMatchPlayer(
          match,
          bestDefender
        );

        if (!defenderValidation.valid) {
          return res.status(400).json({
            message: defenderValidation.message,
          });
        }

        match.bestDefender = bestDefender;
      }
    }

    if (status !== undefined) {
      if (!["scheduled", "completed"].includes(status)) {
        return res.status(400).json({
          message: "Status must be scheduled or completed",
        });
      }

      match.status = status;
    }

    if (summary !== undefined) {
      if (typeof summary !== "string") {
        return res.status(400).json({
          message: "Match summary must be a string",
        });
      }

      match.summary = summary.trim();
    }

    // Determine winner from the current scores.
    // A tied score has no winner in this model.
    if (match.teamAScore > match.teamBScore) {
      match.winner = match.teamA;
    } else if (match.teamBScore > match.teamAScore) {
      match.winner = match.teamB;
    } else {
      match.winner = null;
    }

    await match.save();

    const updatedMatch = await populateMatch(
      TournamentMatch.findById(match._id)
    );

    res.status(200).json({
      message: "Tournament match updated successfully",
      match: updatedMatch,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

/* =========================
   DELETE TOURNAMENT MATCH
========================= */

router.delete("/:id/matches/:matchId", async (req, res) => {
  try {
    const match = await TournamentMatch.findOneAndDelete({
      _id: req.params.matchId,
      tournament: req.params.id,
    });

    if (!match) {
      return res.status(404).json({
        message: "Tournament match not found",
      });
    }

    res.status(200).json({
      message: "Tournament match deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

export default router;