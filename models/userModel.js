import supabase from "../config/supabase.js"

export const createUser = async (email, password) => {
  return await supabase
    .from("users")
    .insert([{ email, password }])
    .select()
}

export const findUserByEmail = async (email) => {
  return await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single()
}