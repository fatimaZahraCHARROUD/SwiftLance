const User = require("./user.model");
const { hashPassword, comparePassword } = require("../../utils/hash");
const { generateToken } = require("../../utils/jwt");

exports.registerUser = async (data) => {
  const existing = await User.findOne({ email: data.email });
  if (existing) throw new Error("Email already exists");

  const hashed = await hashPassword(data.password);

  const user = await User.create({
    fullName: data.fullName,
    email: data.email,
    role: data.role,
    password: hashed,
  });

  const token = generateToken(user);

  return { user, token };
};

exports.loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const token = generateToken(user);

  return { user, token };
};

exports.updateUser = async (userId, data) => {
  return await User.findByIdAndUpdate(userId, data, { new: true });
};