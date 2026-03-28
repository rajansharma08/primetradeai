const asyncHandler = require("../middlewares/asyncHandler");
const authService = require("../services/authService");

const register = asyncHandler(async (req, res) => {
  const result = await authService.registerUser(req.body);
  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: result
  });
});

const login = asyncHandler(async (req, res) => {
  const result = await authService.loginUser(req.body);
  res.status(200).json({
    success: true,
    message: "Login successful",
    data: result
  });
});

module.exports = { register, login };
