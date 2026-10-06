import express from "express";
import multer from "multer";
import path from "path";
import Picture from "../models/Picture.js";
import Video from "../models/Video.js";

const router = express.Router();

// Configure Multer storage for local image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Make sure an 'uploads' folder exists in your server root
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// --- Pictures Endpoints ---
router.get("/pictures", async (req, res) => {
  try {
    const pictures = await Picture.find().sort({ date: -1 });
    res.json(pictures);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Notice `upload.single('image')` middleware here
router.post("/pictures", upload.single("image"), async (req, res) => {
  try {
    const { title } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : req.body.imageUrl;

    const newPic = new Picture({ title, imageUrl });
    const savedPic = await newPic.save();
    res.status(201).json(savedPic);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- Videos Endpoints ---
router.get("/videos", async (req, res) => {
  try {
    const videos = await Video.find().sort({ date: -1 });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/videos", upload.single("video"), async (req, res) => {
  try {
    const { title } = req.body;
    const videoUrl = req.file ? `/uploads/${req.file.filename}` : req.body.videoUrl || "";
    const newVid = new Video({title, videoUrl});
    const savedVid = await newVid.save();
    res.status(201).json(savedVid);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;