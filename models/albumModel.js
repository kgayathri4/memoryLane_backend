import supabase from "../config/supabase.js"

export const getAlbumsByUser = async (userId) => {
  return await supabase
    .from("albums")
    .select("*")
    .eq("user_id", userId)
}

export const createAlbum = async (albumData) => {
  return await supabase
    .from("albums")
    .insert([albumData])
    .select()
}