const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  //["Bearer", "TOKEN"] => [1]: token
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token" });

  try {
    //verify tocken
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //decoded user data
    req.user = decoded;
    //allows req to continue
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};