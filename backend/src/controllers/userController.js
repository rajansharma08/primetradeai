const asyncHandler = require("../middlewares/asyncHandler");
const userService = require("../services/userService");

const getUsers = asyncHandler(async (req, res) => {
  const users = await userService.getAllUsers();
  res.status(200).json({
    success: true,
    data: users
  });
});

const getDashboardSummary = asyncHandler(async (req, res) => {
  const summary = await userService.getAdminDashboardSummary();
  res.status(200).json({
    success: true,
    data: summary
  });
});

const createAdmin = asyncHandler(async (req, res) => {
  const admin = await userService.createAdminUser(req.body);
  res.status(201).json({
    success: true,
    message: "Admin created successfully",
    data: admin
  });
});

const deleteUser = asyncHandler(async (req, res) => {
  await userService.deleteUserById(req.params.id, req.user._id);
  res.status(200).json({
    success: true,
    message: "User removed successfully"
  });
});

module.exports = { getUsers, getDashboardSummary, createAdmin, deleteUser };
