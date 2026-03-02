import express from "express"
import { getAlbums, addAlbum, deleteAlbum } from "../controllers/albumController.js"
import authMiddleware from "../middleware/authMiddleware.js"

const router = express.Router()

router.get("/", authMiddleware, getAlbums)
router.post("/", authMiddleware, addAlbum)
router.delete("/:id", authMiddleware, deleteAlbum) // ✅ Make sure this exists

export default router