import express from "express"
import cors from "cors"
import dotenv from "dotenv"

import authRoutes from "./routes/authRoutes.js"
import memoryRoutes from "./routes/memoryRoutes.js"
import albumRoutes from "./routes/albumRoutes.js"
import errorHandler from "./middleware/errorMiddleware.js"
import voiceNoteRoutes from "./routes/voiceNoteRoutes.js"
dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/memories", memoryRoutes)
app.use("/api/albums", albumRoutes)
app.use("/api/voice-notes", voiceNoteRoutes)

app.get("/", (req, res) => {
  res.send("API Running 🚀")
})

app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
)