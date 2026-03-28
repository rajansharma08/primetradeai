const jwt = require("jsonwebtoken");

const User = require("../models/User");
const asyncHandler = require("./asyncHandler");
const AppError = require("../utils/AppError");

const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("Unauthorized access", 401);
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      throw new AppError("User not found", 401);
    }

    req.user = user;
    next();
  } catch (error) {
    throw new AppError("Invalid or expired token", 401);
  }
});

module.exports = { protect };
