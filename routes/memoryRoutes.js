import express from "express"
import { getMemories, addMemory } from "../controllers/memoryController.js"
import upload from "../middleware/uploadMiddleware.js"
import authMiddleware from "../middleware/authMiddleware.js" // ✅ import auth middleware

const router = express.Router()

// GET all memories (protected)
router.get("/", authMiddleware, getMemories)

// POST memory with multiple images (protected)
router.post("/", authMiddleware, upload.array("images"), addMemory)

export default router