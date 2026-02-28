import { getMemoriesByUser, createMemory } from "../models/memoryModel.js"
import { successResponse, errorResponse } from "../utils/responseHandler.js"

export const getMemories = async (req, res) => {
  try {
    const userId = req.user.id

    const { data, error } = await getMemoriesByUser(userId)

    if (error) return errorResponse(res, error.message)

    successResponse(res, "Memories fetched", data)
  } catch (err) {
    errorResponse(res, err.message)
  }
}

export const addMemory = async (req, res) => {
  try {
    const userId = req.user.id
    const { title, description, image_url, location, date } = req.body

    const { data, error } = await createMemory({
      user_id: userId,
      title,
      description,
      image_url,
      location,
      date,
    })

    if (error) return errorResponse(res, error.message)

    successResponse(res, "Memory created", data)
  } catch (err) {
    errorResponse(res, err.message)
  }
}