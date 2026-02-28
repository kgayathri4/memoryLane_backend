import pool from "../config/db.js";
import supabase from "../config/supabase.js";
import { v4 as uuidv4 } from "uuid";

const bucket = "voice-notes";

export const uploadVoiceNote = async (req, res) => {
  try {
    const { memoryId, mediaType } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileName = `${uuidv4()}-${file.originalname}`;

    const { error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) throw error;

    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    const publicUrl = data.publicUrl;

    let thumbnailUrl = null;

    if (mediaType === "video") {
      thumbnailUrl = publicUrl + "?thumb=true";
    }

    const result = await pool.query(
      `INSERT INTO voice_notes
       (user_id, memory_id, media_url, thumbnail_url, media_type)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING *`,
      [
        req.user.id,
        memoryId || null,
        publicUrl,
        thumbnailUrl,
        mediaType
      ]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0]
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed" });
  }
};

export const getVoiceNotes = async (req, res) => {
  try {
    const { type } = req.query;

    let query = `
      SELECT * FROM voice_notes
      WHERE user_id = $1
    `;

    const params = [req.user.id];

    if (type && type !== "all") {
      query += " AND media_type = $2";
      params.push(type);
    }

    query += " ORDER BY created_at DESC";

    const result = await pool.query(query, params);

    res.json({ data: result.rows });

  } catch (err) {
    res.status(500).json({ message: "Fetch failed" });
  }
};

export const deleteVoiceNote = async (req, res) => {
  try {
    await pool.query(
      `DELETE FROM voice_notes
       WHERE id=$1 AND user_id=$2`,
      [req.params.id, req.user.id]
    );

    res.json({ success: true });
  } catch {
    res.status(500).json({ message: "Delete failed" });
  }
};

export const reactToNote = async (req, res) => {
  try {
    const { type } = req.body;

    await pool.query(
      `INSERT INTO note_reactions (user_id,note_id,type)
       VALUES ($1,$2,$3)`,
      [req.user.id, req.params.id, type]
    );

    res.json({ success: true });
  } catch {
    res.status(500).json({ message: "Reaction failed" });
  }
};

export const addComment = async (req, res) => {
  try {
    const { comment } = req.body;

    const result = await pool.query(
      `INSERT INTO note_comments (user_id,note_id,comment)
       VALUES ($1,$2,$3)
       RETURNING *`,
      [req.user.id, req.params.id, comment]
    );

    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ message: "Comment failed" });
  }
};

export const getComments = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM note_comments
       WHERE note_id=$1
       ORDER BY created_at DESC`,
      [req.params.id]
    );

    res.json(result.rows);
  } catch {
    res.status(500).json({ message: "Fetch comments failed" });
  }
};