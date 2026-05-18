const jwt = require("jsonwebtoken");

//payload: data stored in token, secret: this token created by admin!! 
exports.generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};