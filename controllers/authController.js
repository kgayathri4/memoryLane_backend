import bcrypt from "bcrypt"
import { createUser, findUserByEmail } from "../models/userModel.js"
import generateToken from "../utils/generateToken.js"
import { successResponse, errorResponse } from "../utils/responseHandler.js"

/* ==============================
   REGISTER USER
============================== */
export const register = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password)
      return errorResponse(res, "Email and password are required", 400)
    if (password.length < 6)
      return errorResponse(res, "Password must be at least 6 characters", 400)

    const { data: existingUser, error: findError } = await findUserByEmail(email)
    if (findError) return errorResponse(res, "Database error while checking user", 500)
    if (existingUser) return errorResponse(res, "Email already registered", 400)

    const hashedPassword = await bcrypt.hash(password, 10)
    const { data, error } = await createUser(email, hashedPassword)
    if (error) return errorResponse(res, "Registration failed", 400)

    return successResponse(res, "User registered successfully", { id: data.id, email: data.email })
  } catch (error) {
    console.error("Register Error:", error)
    return errorResponse(res, "Internal server error", 500)
  }
}

/* ==============================
   LOGIN USER
============================== */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return errorResponse(res, "Email and password are required", 400)

    const { data, error } = await findUserByEmail(email)
    if (error || !data) return errorResponse(res, "User not found", 404)

    const isMatch = await bcrypt.compare(password, data.password)
    if (!isMatch) return errorResponse(res, "Invalid credentials", 401)

    const token = generateToken(data.id)

    return successResponse(res, "Login successful", {
      token,
      user: { id: data.id, email: data.email },
    })
  } catch (error) {
    console.error("Login Error:", error)
    return errorResponse(res, "Internal server error", 500)
  }
}