import pool from "../config/db.js";

export const createVoiceNote = async (userId, mediaUrl, mediaType) => {
  const result = await pool.query(
    `INSERT INTO voice_notes (user_id, audio_url, media_type)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [userId, mediaUrl, mediaType]
  );

  return result.rows[0];
};

export const getVoiceNotesByUser = async (userId) => {
  const result = await pool.query(
    "SELECT * FROM voice_notes WHERE user_id = $1 ORDER BY created_at DESC",
    [userId]
  );
  return result.rows;
};

export const deleteVoiceNote = async (id, userId) => {
  await pool.query(
    "DELETE FROM voice_notes WHERE id = $1 AND user_id = $2",
    [id, userId]
  );
};