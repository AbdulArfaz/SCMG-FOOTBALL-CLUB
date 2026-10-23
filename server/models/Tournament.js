import mongoose from "mongoose";

const tournamentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      default: null,
    },

    venue: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed"],
      default: "upcoming",
    },

    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TournamentTeam",
      default: null,
    },

    bestScorer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
      default: null,
    },

    bestDefender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
      default: null,
    },

    bestPlayer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Tournament", tournamentSchema);