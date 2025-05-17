const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const protect = async (req, res, next) => {
  try {
    // bearer token
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token)
      return res.status(401).json({ message: "not authorization not token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.user);

    if (!user) return res.status(401).json({ message: "not authorization" });

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "token is invalid or expered" });
  }
};
const protectAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "access denied , amin only" });
  }
  next();
};

module.exports = { protect, protectAdmin };
