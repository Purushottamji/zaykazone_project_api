const twilio = require("twilio");
const User = require("../models/userModel"); 
const jwt = require("jsonwebtoken");
const UserToken = require("../models/token");
const db = require("../db");   
const dotenv = require("dotenv");
dotenv.config();

const client = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH
);

let otpStore = {};
const otpChangeStore = {}; 

const sendOtp = async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ message: "Phone required" });
  }

  const phoneRegex = /^[6-9]\d{9}$/;

  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ message: "Invalid mobile number format" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000);

  otpStore[phone] = {
    otp: otp,
    expires: Date.now() + 2 * 60 * 1000,
  };

  try {
    await client.messages.create({
      body: `Your OTP is ${otp}`,
      from: process.env.TWILIO_SMS_NUMBER,
      to: `+91${phone}`
    });

    res.json({ message: "OTP Sent Successfully" });

  } catch (err) {
    res.status(500).json({ message: "Error sending OTP", error: err });
  }
};

const verifyOtp = async (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp)
    return res.status(400).json({ message: "Phone and OTP are required" });

  if (!otpStore[phone]) {
    return res.status(400).json({ message: "OTP expired or invalid" });
  }

  if (Date.now() > otpStore[phone].expires) {
    delete otpStore[phone];
    return res.status(400).json({ message: "OTP expired" });
  }

  if (otpStore[phone].otp != otp) {
    return res.status(400).json({ message: "Incorrect OTP" });
  }

  delete otpStore[phone];

      let user = await User.findUserByMobile(phone);
      if (!user) {
        const { insertId } = await User.createUser({
          name: null,
          email: null,
          password: null,
          mobile: phone,
          user_pic: null
        });
        user = await User.findUserById(insertId);
      }

      const payload = { id: user.id, mobile: user.mobile };
      const accessToken = UserToken.createAccessToken(payload);
      const refreshToken = UserToken.createRefreshToken();

    const expiresAt = new Date(Date.now() + 30*24*60*60*1000); // 30 days
    await db.execute(
      "INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)",
      [user.id, refreshToken, expiresAt]
    );

  return res.json({
    message: "Login Successful",
    token: accessToken,
    refreshToken,
    user
  });
};

module.exports = { sendOtp, verifyOtp };
