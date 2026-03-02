import supabase from "../config/supabase.js"

/**
 * Get all memories for a specific user
 * Optionally filter by albumId
 * Ensures image_url is always an array
 */
export const getMemoriesByUser = async (userId, albumId = null) => {
  try {
    let query = supabase
      .from("memories")
      .select("*")
      .eq("user_id", userId)

    if (albumId) {
      query = query.eq("album_id", albumId) // filter by album
    }

    const { data, error } = await query.order("date", { ascending: false })

    if (error) throw error

    // Make sure image_url is always an array
    const formattedData = data.map((memory) => ({
      ...memory,
      image_url: Array.isArray(memory.image_url)
        ? memory.image_url
        : memory.image_url
        ? [memory.image_url]
        : [],
    }))

    return { data: formattedData }
  } catch (error) {
    console.error("getMemoriesByUser error:", error)
    return { error }
  }
}

/**
 * Create a new memory
 * Ensures image_url is stored as an array
 */
export const createMemory = async (memoryData) => {
  try {
    const memoryToInsert = {
      ...memoryData,
      image_url: Array.isArray(memoryData.image_url)
        ? memoryData.image_url
        : memoryData.image_url
        ? [memoryData.image_url]
        : [],
    }

    const { data, error } = await supabase
      .from("memories")
      .insert([memoryToInsert])
      .select()

    if (error) throw error

    // Return the inserted memory with image_url guaranteed as array
    const formattedData = data.map((memory) => ({
      ...memory,
      image_url: Array.isArray(memory.image_url)
        ? memory.image_url
        : memory.image_url
        ? [memory.image_url]
        : [],
    }))

    return { data: formattedData[0] }
  } catch (error) {
    console.error("createMemory error:", error)
    return { error }
  }
}

/**
 * Get all memories for a specific album
 * Returns image_url as array
 */
export const getMemoriesByAlbum = async (albumId) => {
  try {
    const { data, error } = await supabase
      .from("memories")
      .select("*")
      .eq("album_id", albumId)
      .order("date", { ascending: false })

    if (error) throw error

    const formattedData = data.map((memory) => ({
      ...memory,
      image_url: Array.isArray(memory.image_url)
        ? memory.image_url
        : memory.image_url
        ? [memory.image_url]
        : [],
    }))

    return { data: formattedData }
  } catch (error) {
    console.error("getMemoriesByAlbum error:", error)
    return { error }
  }
}