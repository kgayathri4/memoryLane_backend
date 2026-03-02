import express from "express";
import multer from "multer";
import protect from "../middleware/authMiddleware.js";
import {
  uploadVoiceNote,
  getVoiceNotes,
  deleteVoiceNote,
  reactToNote,
  addComment,
  getComments,
} from "../controllers/voiceNoteController.js";

const router = express.Router();
const upload = multer(); // uses memory storage for Supabase

router.post("/upload", protect, upload.single("file"), uploadVoiceNote);
router.get("/", protect, getVoiceNotes);
router.delete("/:id", protect, deleteVoiceNote);

router.post("/:id/react", protect, reactToNote);
router.post("/:id/comment", protect, addComment);
router.get("/:id/comments", protect, getComments);

export default router;