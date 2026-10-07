import express from "express";
import multer from "multer";
import fs from "fs";
import Picture from "../models/Picture.js";
import Video from "../models/Video.js";
import { imagekit } from "../services/imagekitClient.js";

const router = express.Router();

// Use temporary local folder instead of RAM buffer
const upload = multer({ dest: "uploads/" });

// --- Pictures Endpoints ---
router.get("/pictures", async (req, res) => {
  try {
    const pictures = await Picture.find().sort({ date: -1 });
    res.json(pictures);
  } catch (err) {
    console.error("Error fetching pictures:", err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/pictures", upload.single("image"), async (req, res) => {
  try {
    const { title } = req.body;
    let imageUrl = req.body.imageUrl || "";

    if (req.file) {
      // Read the temporary file from disk stream
      const fileStream = fs.createReadStream(req.file.path);

      const uploadResponse = await imagekit.upload({
        file: fileStream,
        fileName: `${Date.now()}-${req.file.originalname}`,
        folder: "/club-pictures",
      });
      imageUrl = uploadResponse.url;

      // Clean up the temp file from Render's disk
      fs.unlinkSync(req.file.path);
    }

    const newPic = new Picture({ title, imageUrl });
    const savedPic = await newPic.save();
    res.status(201).json(savedPic);
  } catch (err) {
    if (req.file && req.file.path) fs.unlinkSync(req.file.path); // Cleanup on error
    console.error("Error saving picture to ImageKit:", err);
    res.status(400).json({ error: err.message });
  }
});

// --- Videos Endpoints ---
router.get("/videos", async (req, res) => {
  try {
    const videos = await Video.find().sort({ date: -1 });
    res.json(videos);
  } catch (err) {
    console.error("Error fetching videos:", err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/videos", upload.single("video"), async (req, res) => {
  try {
    const { title } = req.body;
    let videoUrl = req.body.videoUrl || "";

    if (req.file) {
      // Read the temporary video file from disk stream
      const fileStream = fs.createReadStream(req.file.path);

      const uploadResponse = await imagekit.upload({
        file: fileStream,
        fileName: `${Date.now()}-${req.file.originalname}`,
        folder: "/club-videos",
      });
      videoUrl = uploadResponse.url;

      // Clean up the temp file from Render's disk
      fs.unlinkSync(req.file.path);
    }

    const newVid = new Video({ title, videoUrl });
    const savedVid = await newVid.save();
    res.status(201).json(savedVid);
  } catch (err) {
    if (req.file && req.file.path) fs.unlinkSync(req.file.path); // Cleanup on error
    console.error("Error saving video to ImageKit:", err);
    res.status(400).json({ error: err.message });
  }
});

export default router;