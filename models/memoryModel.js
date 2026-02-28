import supabase from "../config/supabase.js"

export const getMemoriesByUser = async (userId) => {
  return await supabase
    .from("memories")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false })
}

export const createMemory = async (memoryData) => {
  return await supabase
    .from("memories")
    .insert([memoryData])
    .select()
}