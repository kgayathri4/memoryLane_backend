import { getAlbumsByUser, createAlbum } from "../models/albumModel.js"
import { successResponse, errorResponse } from "../utils/responseHandler.js"

export const getAlbums = async (req, res) => {
  try {
    const userId = req.user.id

    const { data, error } = await getAlbumsByUser(userId)

    if (error) return errorResponse(res, error.message)

    successResponse(res, "Albums fetched", data)
  } catch (err) {
    errorResponse(res, err.message)
  }
}

export const addAlbum = async (req, res) => {
  try {
    const userId = req.user.id
    const { name } = req.body

    const { data, error } = await createAlbum({
      user_id: userId,
      name,
    })

    if (error) return errorResponse(res, error.message)

    successResponse(res, "Album created", data)
  } catch (err) {
    errorResponse(res, err.message)
  }
}