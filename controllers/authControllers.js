const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const UserToken = require("../models/token");
const db=require("../db");


const registerUser = async (req, res) => {
  try {
    const { name, email, password, mobile } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const existing = await User.findUserByEmail(email);
    if (existing)
      return res.status(400).json({ message: "Email already in use" });

    const existingMobile = await User.findUserByMobile(mobile);
    if (existingMobile)
      return res.status(400).json({ message: "Mobile already in use" });

    const hashed = await bcrypt.hash(password, 10);
    const user_pic = req.file ? req.file.filename : null;

    const { insertId } = await User.createUser({
      name,
      email,
      password: hashed,
      mobile,
      user_pic
    });

    const user = await User.findUserById(insertId);
    res.status(201).json({ user });

  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const user = await User.findUserByEmail(email);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid password" });

  
    const accessToken = UserToken.createAccessToken({ id: user.id, email: user.email });
    const refreshToken = UserToken.createRefreshToken();

    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    await db.execute(
      "INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)",
      [user.id, refreshToken, expiresAt]
    );

    res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        user_pic: user.user_pic ?? null,
      }
    });

    console.log("Login Request Body:", req.body);
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// POST /auth/refresh
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: "Refresh token required" });

    const [rows] = await db.execute(
      "SELECT user_id, expires_at FROM refresh_tokens WHERE token = ? LIMIT 1",
      [refreshToken]
    );

    if (!rows.length) return res.status(401).json({ message: "Invalid refresh token" });

    const r = rows[0];
    if (new Date(r.expires_at) < new Date()) {
      // delete expired
      await db.execute("DELETE FROM refresh_tokens WHERE token = ?", [refreshToken]);
      return res.status(401).json({ message: "Refresh token expired" });
    }

    // issue new access token (and optionally new refresh token)
    const userId = r.user_id;
    const [urows] = await db.execute("SELECT id, mobile FROM user_info WHERE id = ? LIMIT 1", [userId]);
    if (!urows.length) return res.status(404).json({ message: "User not found" });

    const user = urows[0];
    const newAccessToken = createAccessToken({ id: user.id, mobile: user.mobile });

    return res.json({ token: newAccessToken });

  } catch (err) {
    console.error("Refresh error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /auth/logout
const logout = async (req, res) => {
  try {
    const auth = req.headers.authorization;
    const { refreshToken } = req.body; // optional

    if (auth) {
      const accessToken = auth.split(" ")[1];
      // blacklist access token
      await db.execute("INSERT INTO token_blacklist (token) VALUES (?)", [accessToken]);
    }

    if (refreshToken) {
      await db.execute("DELETE FROM refresh_tokens WHERE token = ?", [refreshToken]);
    }

    return res.json({ message: "Logged out" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email)
    return res.status(400).json({ message: "Email required" });

  const [rows] = await db.query(
    "SELECT id FROM user_info WHERE email = ?",
    [email]
  );

  if (rows.length === 0) {
    return res.status(404).json({ message: "Email not registered" });
  }

  const OTP = "9876";

  res.status(200).json({
    message: "OTP sent successfully",
    otp: OTP // ⚠️ normally NEVER return OTP
  });
};

const verifyOtp = async (req, res) => {
  const { otp } = req.body;

  if (!otp)
    return res.status(400).json({ message: "OTP required" });

  if (otp !== "9876") {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  res.status(200).json({ message: "OTP verified" });
};


const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ message: "All fields required" });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const [result] = await db.query(
    "UPDATE user_info SET password = ? WHERE email = ?",
    [hashedPassword, email]
  );

  if (result.affectedRows === 0) {
    return res.status(400).json({ message: "Password update failed" });
  }

  res.status(200).json({ message: "Password updated successfully" });
};

module.exports = { registerUser, loginUser, refreshToken, logout ,forgotPassword ,verifyOtp, resetPassword};
