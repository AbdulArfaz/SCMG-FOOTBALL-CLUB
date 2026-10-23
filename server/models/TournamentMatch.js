import mongoose from "mongoose";

const goalScorerSchema = new mongoose.Schema(
  {
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
      required: true,
    },

    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TournamentTeam",
      required: true,
    },

    goals: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
  },
  { _id: false }
);

const tournamentMatchSchema = new mongoose.Schema(
  {
    tournament: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tournament",
      required: true,
    },

    stage: {
      type: String,
      enum: ["group", "quarter-final", "semi-final", "final", "other"],
      required: true,
    },

    matchNumber: {
      type: Number,
      required: true,
      min: 1,
    },

    teamA: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TournamentTeam",
      required: true,
    },

    teamB: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TournamentTeam",
      required: true,
    },

    date: {
      type: Date,
      default: null,
    },

    teamAScore: {
      type: Number,
      min: 0,
      default: 0,
    },

    teamBScore: {
      type: Number,
      min: 0,
      default: 0,
    },

    goalScorers: {
      type: [goalScorerSchema],
      default: [],
    },

    // Best defender for this individual match
    bestDefender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
      default: null,
    },

    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TournamentTeam",
      default: null,
    },

    status: {
      type: String,
      enum: ["scheduled", "completed"],
      default: "scheduled",
    },

    summary: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true }
);

tournamentMatchSchema.index(
  { tournament: 1, matchNumber: 1 },
  { unique: true }
);

export default mongoose.model("TournamentMatch", tournamentMatchSchema);