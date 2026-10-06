import mongoose from "mongoose";

const pictureSchema = new mongoose.Schema({
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

export default mongoose.model("Picture", pictureSchema);