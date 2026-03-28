const jwt = require("jsonwebtoken");

const User = require("../models/User");
const AppError = require("../utils/AppError");

const signToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d"
  });

const registerUser = async ({ name, email, password, role }) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new AppError("User already exists with this email", 409);
  }

  const normalizedRole = role === "admin" ? "admin" : "user";
  const user = await User.create({
    name,
    email,
    password,
    role: normalizedRole
  });

  const safeUser = user.toSafeObject();

  return {
    user: safeUser,
    token: signToken(user._id, user.role)
  };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });

  if (!user || !(await user.comparePassword(password))) {
    throw new AppError("Invalid email or password", 401);
  }

  return {
    user: user.toSafeObject(),
    token: signToken(user._id, user.role)
  };
};

module.exports = { registerUser, loginUser };
