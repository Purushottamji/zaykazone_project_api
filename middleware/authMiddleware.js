
const { verifyAccessToken, isTokenBlacklisted } = require("../models/token");

const authMiddleware = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ message: "Unauthorized" });

    const token = auth.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    // check blacklist
    const blacklisted = await isTokenBlacklisted(token);
    if (blacklisted) return res.status(401).json({ message: "Token revoked" });

    const decoded = verifyAccessToken(token);
    req.user = decoded; // { id, mobile, ... }
    next();
  } catch (err) {
  console.error("Auth error:", err);

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ code: "TOKEN_EXPIRED" });
  }

  return res.status(401).json({ message: "Invalid token" });
}

};


module.exports = { authMiddleware };