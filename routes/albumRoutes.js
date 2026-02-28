import express from "express"
import { getAlbums, addAlbum } from "../controllers/albumController.js"
import authMiddleware from "../middleware/authMiddleware.js"

const router = express.Router()

router.get("/", authMiddleware, getAlbums)
router.post("/", authMiddleware, addAlbum)

export default router