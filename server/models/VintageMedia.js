import mongoose from "mongoose";

const vintageMediaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  mediaUrl: { type: String, required: true },
  mediaType: { type: String, enum: ["image", "video"], required: true },
  date: { type: Date, default: Date.now },
});

export default mongoose.model("VintageMedia", vintageMediaSchema);