import multer from "multer";

// Memory storage for multer (file stays in memory before uploading to Supabase)
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // max 50MB
});

export default upload;