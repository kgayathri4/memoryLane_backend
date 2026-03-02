import pool from "../config/db.js";
import supabase from "../config/supabase.js";
import { v4 as uuidv4 } from "uuid";

// Supabase storage bucket
const BUCKET = "voice-notes";

/**
 * Upload a new voice/video note
 */
export const uploadVoiceNote = async (req, res) => {
  try {
    const { memoryId, mediaType } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ message: "No file uploaded" });

    const fileName = `${uuidv4()}-${file.originalname}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(fileName, file.buffer, { contentType: file.mimetype });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
    const publicUrl = data.publicUrl;

    let thumbnailUrl = null;
    if (mediaType === "video") {
      thumbnailUrl = publicUrl + "?thumb=true"; // optional thumbnail query
    }

    const result = await pool.query(
      `INSERT INTO voice_notes (user_id, memory_id, media_url, thumbnail_url, media_type)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [req.user.id, memoryId || null, publicUrl, thumbnailUrl, mediaType]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error("uploadVoiceNote error:", err);
    res.status(500).json({ message: "Upload failed" });
  }
};

/**
 * Fetch all notes for the user (optionally filtered by type)
 */
export const getVoiceNotes = async (req, res, next) => {
  try {
    const { type } = req.query; // "all", "audio", or "video"

    // Fetch notes from DB (example with pseudo DB call)
    let notes;
    if (type === "audio") {
      notes = await db.voiceNotes.find({ media_type: "audio" });
    } else if (type === "video") {
      notes = await db.voiceNotes.find({ media_type: "video" });
    } else {
      notes = await db.voiceNotes.find({});
    }

    res.json({ data: notes });
  } catch (err) {
    console.error("GET /voice-notes error:", err);
    res.status(500).json({ message: "Server error fetching notes" });
  }
};
/**
 * Delete a voice note by ID
 */
export const deleteVoiceNote = async (req, res) => {
  try {
    const result = await pool.query(
      `DELETE FROM voice_notes WHERE id=$1 AND user_id=$2 RETURNING *`,
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Note not found" });

    res.json({ success: true });
  } catch (err) {
    console.error("deleteVoiceNote error:", err);
    res.status(500).json({ message: "Delete failed" });
  }
};

/**
 * React to a note (like)
 */
export const reactToNote = async (req, res) => {
  try {
    const { type } = req.body;

    await pool.query(
      `INSERT INTO note_reactions (user_id, note_id, type)
       VALUES ($1, $2, $3)`,
      [req.user.id, req.params.id, type]
    );

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM note_reactions WHERE note_id=$1`,
      [req.params.id]
    );

    res.json({ count: parseInt(countResult.rows[0].count, 10) });
  } catch (err) {
    console.error("reactToNote error:", err);
    res.status(500).json({ message: "Reaction failed" });
  }
};

/**
 * Add comment to a note
 */
export const addComment = async (req, res) => {
  try {
    const { comment } = req.body;

    const result = await pool.query(
      `INSERT INTO note_comments (user_id, note_id, comment)
       VALUES ($1, $2, $3) RETURNING *`,
      [req.user.id, req.params.id, comment]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("addComment error:", err);
    res.status(500).json({ message: "Comment failed" });
  }
};

/**
 * Fetch comments for a note
 */
export const getComments = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM note_comments WHERE note_id=$1 ORDER BY created_at DESC`,
      [req.params.id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("getComments error:", err);
    res.status(500).json({ message: "Fetch comments failed" });
  }
};