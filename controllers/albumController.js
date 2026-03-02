import { getAlbumsByUser, createAlbum, deleteAlbumById } from "../models/albumModel.js"
import { getMemoriesByAlbum } from "../models/memoryModel.js"
import { successResponse, errorResponse } from "../utils/responseHandler.js"

// GET all albums with photo count and cover
export const getAlbums = async (req, res) => {
  try {
    const userId = req.user.id

    const { data: albums, error: albumsError } = await getAlbumsByUser(userId)
    if (albumsError) return errorResponse(res, albumsError.message)

    // Compute image count and cover image
    const formattedAlbums = await Promise.all(
      albums.map(async (album) => {
        const { data: memories, error } = await getMemoriesByAlbum(album.id)
        const image_count = memories?.length || 0
        const cover_image = memories?.[0]?.image_url?.[0] || null
        return { ...album, image_count, cover_image }
      })
    )

    successResponse(res, "Albums fetched", formattedAlbums)
  } catch (err) {
    errorResponse(res, err.message)
  }
}

// CREATE album
export const addAlbum = async (req, res) => {
  try {
    const userId = req.user.id
    const { name } = req.body

    const { data, error } = await createAlbum({ user_id: userId, name })
    if (error) return errorResponse(res, error.message)

    successResponse(res, "Album created", data)
  } catch (err) {
    errorResponse(res, err.message)
  }
}

// DELETE album
export const deleteAlbum = async (req, res) => {
  try {
    const userId = req.user.id
    const { id } = req.params

    const { data, error } = await deleteAlbumById(id, userId)
    if (error) return errorResponse(res, error.message)

    successResponse(res, "Album deleted successfully", data)
  } catch (err) {
    errorResponse(res, err.message)
  }
}