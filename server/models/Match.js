import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema({
  date: { type: Date, required: true, default: Date.now },
  teamAScore: { type: Number, required: true, default: 0 },
  teamBScore: { type: Number, required: true, default: 0 },
}, { timestamps: true });

export default mongoose.model('Match', matchSchema);