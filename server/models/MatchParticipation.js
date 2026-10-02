import mongoose from 'mongoose';

const matchParticipationSchema = new mongoose.Schema({
  match: { type: mongoose.Schema.Types.ObjectId, ref: 'Match', required: true },
  player: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true },
  team: { type: String, enum: ['A', 'B'], required: true },
  goals: { type: Number, required: true, default: 0 },
  tackles: { type: Number, required: true, default: 0 },
  assists: { type: Number, required: true, default: 0 },
  won: { type: Boolean, required: true }
}, { timestamps: true });

export default mongoose.model('MatchParticipation', matchParticipationSchema);