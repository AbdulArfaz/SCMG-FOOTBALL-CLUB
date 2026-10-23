import mongoose from "mongoose";

const tournamentTeamSchema = new mongoose.Schema(
  {
    tournament: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tournament",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    players: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Player",
      },
    ],

    logo: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// A team name should be unique within the same tournament.
tournamentTeamSchema.index(
  { tournament: 1, name: 1 },
  { unique: true }
);

export default mongoose.model("TournamentTeam", tournamentTeamSchema);