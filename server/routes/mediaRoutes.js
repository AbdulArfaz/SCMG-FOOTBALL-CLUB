import express from "express";
import multer from "multer";
import Picture from "../models/Picture.js";
import Video from "../models/Video.js";
import { imagekit } from "../services/imagekitClient.js";

const router = express.Router();

// Keep files temporarily in memory RAM buffer for cloud uploading
const upload = multer({ storage: multer.memoryStorage() });

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
      // Upload file buffer straight to ImageKit cloud
      const uploadResponse = await imagekit.upload({
        file: req.file.buffer,
        fileName: `${Date.now()}-${req.file.originalname}`,
        folder: "/club-pictures",
      });
      imageUrl = uploadResponse.url; // Permanent public URL
    }

    const newPic = new Picture({ title, imageUrl });
    const savedPic = await newPic.save();
    res.status(201).json(savedPic);
  } catch (err) {
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
      // Upload file buffer straight to ImageKit cloud
      const uploadResponse = await imagekit.upload({
        file: req.file.buffer,
        fileName: `${Date.now()}-${req.file.originalname}`,
        folder: "/club-videos",
      });
      videoUrl = uploadResponse.url; // Permanent public URL
    }

    const newVid = new Video({ title, videoUrl });
    const savedVid = await newVid.save();
    res.status(201).json(savedVid);
  } catch (err) {
    console.error("Error saving video to ImageKit:", err);
    res.status(400).json({ error: err.message });
  }
});

export default router;