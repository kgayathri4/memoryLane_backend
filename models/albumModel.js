import supabase from "../config/supabase.js"

// Get albums by user
export const getAlbumsByUser = async (userId) => {
  return await supabase
    .from("albums")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
}

// Create album
export const createAlbum = async (albumData) => {
  return await supabase.from("albums").insert([albumData]).select()
}

// Delete album
export const deleteAlbumById = async (albumId, userId) => {
  return await supabase
    .from("albums")
    .delete()
    .eq("id", albumId)
    .eq("user_id", userId)
    .select()
}

export const getMemoriesByUserAndAlbum = async (userId, albumId) => {
  return await supabase
    .from("memories")
    .select("*")
    .eq("user_id", userId)
    .eq("album_id", albumId)
    .order("date", { ascending: false })
}