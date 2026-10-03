import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  role: { type: String, default: 'Player' },
  age: { type: Number },
  avatar: {
  type: String,
  default: "https://i.pinimg.com/736x/18/60/67/186067c3c81040a68a049b9344b9f995.jpg"
}
}, { timestamps: true });

export default mongoose.model('Player', playerSchema);