import jwt from "jsonwebtoken"
import { errorResponse } from "../utils/responseHandler.js"

const protect = (req, res, next) => {
  let token

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1]
  }

  if (!token) {
    return errorResponse(res, "Not authorized, no token", 401)
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    return errorResponse(res, "Invalid token", 401)
  }
}

export default protect