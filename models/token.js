

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const db = require("../db");

// Access Token
const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "90d",
  });
};

// Refresh Token
const createRefreshToken = () => {
  return crypto.randomBytes(48).toString("hex");
};

// Verify Token
const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

//  Blacklist check
const isTokenBlacklisted = async (token) => {
  const [rows] = await db.execute(
    "SELECT id FROM token_blacklist WHERE token = ? LIMIT 1",
    [token]
  );
  return rows.length > 0;
};

module.exports = {
  createAccessToken,
  createRefreshToken,
  verifyAccessToken,
  isTokenBlacklisted,
};

// const jwt = require("jsonwebtoken");
// const crypto = require("crypto");
// const db = require("../db"); 

// const createAccessToken = (payload) =>
//   jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "90d" });

// const createRefreshToken = () =>
//   crypto.randomBytes(48).toString("hex");

// const verifyAccessToken = (token) => jwt.verify(token, process.env.JWT_SECRET);

// const isTokenBlacklisted = async (token) => {
//   const [rows] = await db.execute("SELECT id FROM token_blacklist WHERE token = ? LIMIT 1", [token]);
//   return rows.length > 0;
// };

// module.exports = {
//   createAccessToken,
//   createRefreshToken,
//   verifyAccessToken,
//   isTokenBlacklisted,
// };