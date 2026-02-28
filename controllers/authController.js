import bcrypt from "bcrypt"
import { createUser, findUserByEmail } from "../models/userModel.js"
import generateToken from "../utils/generateToken.js"
import { successResponse, errorResponse } from "../utils/responseHandler.js"

export const register = async (req, res) => {
  const { email, password } = req.body

  const hashedPassword = await bcrypt.hash(password, 10)

  const { data, error } = await createUser(email, hashedPassword)

  if (error) return errorResponse(res, error.message)

  successResponse(res, "User registered successfully", data)
}

export const login = async (req, res) => {
  const { email, password } = req.body

  const { data, error } = await findUserByEmail(email)

  if (error || !data)
    return errorResponse(res, "User not found")

  const isMatch = await bcrypt.compare(password, data.password)

  if (!isMatch)
    return errorResponse(res, "Invalid credentials")

  const token = generateToken(data.id)

  successResponse(res, "Login successful", { token })
}