import express from "express";
import multer from "multer";
import VintageMedia from "../models/VintageMedia.js";
import { vintageImagekit } from "../services/vintageImagekitClient.js";
import fs from 'fs';

const router = express.Router();

// Configure multer for local temporary storage before ImageKit upload
const upload = multer({ dest: "uploads/" });

// --- Vintage Pictures Endpoints ---
router.get("/vintage-pictures", async (req, res) => {
  try {
    const pictures = await VintageMedia.find({ mediaType: "image" }).sort({ date: -1 });
    res.json(pictures);
  } catch (err) {
    console.error("Error fetching vintage pictures:", err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/vintage-pictures", upload.single("image"), async (req, res) => {
  try {
    const { title } = req.body;
    let mediaUrl = "";

    if (req.file) {
      const fileStream = fs.createReadStream(req.file.path);
      const uploadResponse = await vintageImagekit.upload({
        file: fileStream,
        fileName: `${Date.now()}-${req.file.originalname}`,
        folder: "/vintage-pictures",
      });
      mediaUrl = uploadResponse.url;
      fs.unlinkSync(req.file.path);
    }

    const newPic = new VintageMedia({ 
      title, 
      mediaUrl, 
      mediaType: "image" 
    });
    
    const savedPic = await newPic.save();
    res.status(201).json(savedPic);
  } catch (err) {
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    console.error("Error saving vintage picture:", err);
    res.status(400).json({ error: err.message });
  }
});

// --- Vintage Videos Endpoints ---
router.get("/vintage-videos", async (req, res) => {
  try {
    const videos = await VintageMedia.find({ mediaType: "video" }).sort({ date: -1 });
    res.json(videos);
  } catch (err) {
    console.error("Error fetching vintage videos:", err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/vintage-videos", upload.single("video"), async (req, res) => {
  try {
    const { title } = req.body;
    let mediaUrl = "";

    if (req.file) {
      const fileStream = fs.createReadStream(req.file.path);
      const uploadResponse = await vintageImagekit.upload({
        file: fileStream,
        fileName: `${Date.now()}-${req.file.originalname}`,
        folder: "/vintage-videos",
      });
      mediaUrl = uploadResponse.url;
      fs.unlinkSync(req.file.path);
    }

    const newVid = new VintageMedia({ 
      title, 
      mediaUrl, 
      mediaType: "video" 
    });
    
    const savedVid = await newVid.save();
    res.status(201).json(savedVid);
  } catch (err) {
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    console.error("Error saving vintage video:", err);
    res.status(400).json({ error: err.message });
  }
});

export default router;