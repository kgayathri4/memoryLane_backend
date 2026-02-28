import express from "express"
import Memory from "../models/Memory.js"

const router = express.Router()

// CREATE MEMORY
router.post("/", async (req, res) => {
  try {
    const { title, description, image_url, location, date } = req.body

    const newMemory = new Memory({
      title,
      description,
      image_url,
      location,
      date,
    })

    const savedMemory = await newMemory.save()

    res.status(201).json(savedMemory)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Failed to create memory" })
  }
})

// GET ALL MEMORIES
router.get("/", async (req, res) => {
  try {
    const memories = await Memory.find().sort({ createdAt: -1 })
    res.json(memories)
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch memories" })
  }
})

export default router