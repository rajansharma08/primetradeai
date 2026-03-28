const mongoose = require("mongoose");

const User = require("../models/User");
const Book = require("../models/Book");
const AppError = require("../utils/AppError");

const getAllUsers = async () =>
  User.find().select("-password").sort({ createdAt: -1 });

const getAdminDashboardSummary = async () => {
  const [totalUsers, totalBooks] = await Promise.all([
    User.countDocuments(),
    Book.countDocuments()
  ]);

  return {
    totalUsers,
    totalBooks
  };
};

const createAdminUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new AppError("User already exists with this email", 409);
  }

  const admin = await User.create({
    name,
    email,
    password,
    role: "admin"
  });

  return admin.toSafeObject();
};

const deleteUserById = async (targetUserId, currentUserId) => {
  if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
    throw new AppError("Invalid user id", 400);
  }

  if (targetUserId.toString() === currentUserId.toString()) {
    throw new AppError("You cannot remove your own account", 400);
  }

  const user = await User.findById(targetUserId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.role === "admin") {
    throw new AppError("Use admin management to handle admin accounts", 403);
  }

  await Book.updateMany({ issuedTo: user._id }, { available: true, issuedTo: null });
  await User.findByIdAndDelete(targetUserId);
};

module.exports = { getAllUsers, getAdminDashboardSummary, createAdminUser, deleteUserById };
