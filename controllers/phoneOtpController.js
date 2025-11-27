const twilio = require("twilio");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const client = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH
);

let otpStore = {};

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

  const token = jwt.sign({ phone }, process.env.JWT_SECRET, { expiresIn: "7d" });

  return res.json({
    message: "Login Successful",
    token,
    user: { phone }
  });
};

module.exports = { sendOtp, verifyOtp };
