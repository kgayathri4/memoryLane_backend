import { createMemory, getMemoriesByUser } from "../models/memoryModel.js"

/* GET memories */
export const getMemories = async (req, res) => {
  try {
    if (!req.user || !req.user.id)
      return res.status(401).json({ message: "Unauthorized. Token missing or invalid." })

    const userId = req.user.id
    const albumId = req.query.album_id  // <-- get album_id from query
    if (!albumId) return res.status(400).json({ message: "album_id is required" })
    const { data, error } = await getMemoriesByUser(userId, albumId)
    if (error) return res.status(400).json({ message: error.message })

    res.json({ message: "Memories fetched", data })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err.message })
  }
}

/* ADD memory */
export const addMemory = async (req, res) => {
  try {
    if (!req.user || !req.user.id)
      return res.status(401).json({ message: "Unauthorized. Token missing or invalid." })

    const userId = req.user.id
    const { title = "Untitled", description = "", location = "", date = "" } = req.body

    if (!req.files || req.files.length === 0)
      return res.status(400).json({ message: "No images uploaded" })

    const images = req.files.map((file) => `/uploads/${file.filename}`)
    const { data, error } = await createMemory({
      user_id: req.user.id,
      album_id: req.body.album_id, // <-- include album_id
      title: req.body.title,
      description: req.body.description,
      location: req.body.location,
      date: req.body.date,
      image_url: images,
    })

    if (error) return res.status(400).json({ message: error.message })

    res.status(201).json({ message: "Memory uploaded", data })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Upload failed" })
  }
}