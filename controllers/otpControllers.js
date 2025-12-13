const twilio = require("twilio");
const dotenv = require("dotenv");
const User = require("../models/userModel"); 
const jwt = require("jsonwebtoken");
const UserToken = require("../models/token");
const db = require("../db");   

dotenv.config();

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);

const otpStore = {};
const otpChangeStore = {}; 


const sendOtp=async (req,res)=>{
    try{
        const {phone} =req.body;
        if(!phone) return res.status(400).json({message:"Mobile number required"});

         const phoneRegex = /^[6-9]\d{9}$/;

    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ message: "Invalid mobile number format" });
    }

        const otp=Math.floor(100000 + Math.random() * 900000);
        otpStore[phone]=otp;

        await client.messages.create({
            from:process.env.TWILIO_WHATSAPP_NUMBER,
            to: `whatsapp:+91${phone}`,
            body: `Your ZaykaZone OTP is : ${otp}`
        });

        res.status(200).json({message:"OTP sent via whatsapp"});
    }catch(err){
        console.error("OTP error:",err);
        res.status(500).json({message:"Failed to send OTP"});
    }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.user; // from JWT middleware
    const { name, email ,bio} = req.body;

    let user_pic = null;

    if (req.file) {
      user_pic = req.file.filename;
    }

    const sql = `
      UPDATE user_info 
      SET name = ?, email = ?,user_bio= ?, user_pic = COALESCE(?, user_pic) 
      WHERE id = ?
    `;

    await db.execute(sql, [name, email, bio ,user_pic, id]);

    const [rows] = await db.execute(
      "SELECT id, name, email, mobile,user_bio, user_pic FROM user_info WHERE id = ?",
      [id]
    );

    res.json({ message: "Profile updated", user: rows[0] });

  } catch (err) {
    console.error("Profile Update Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) return res.status(400).json({ message: "Phone and OTP required" });

    if (otpStore[phone] != otp) return res.status(400).json({ message: "Invalid OTP" });

    delete otpStore[phone];

    // find or create user (use your existing User model)
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

    // store refresh token in DB
    const expiresAt = new Date(Date.now() + 30*24*60*60*1000); // 30 days
    await db.execute(
      "INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)",
      [user.id, refreshToken, expiresAt]
    );

    return res.status(200).json({
      message: "OTP verified",
      token: accessToken,
      refreshToken,
      user
    });

  } catch (err) {
    console.error("OTP verify error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const sendOtpChange = async (req, res) => {
  try {
    const { newPhone } = req.body;
    if (!newPhone) return res.status(400).json({ message: "New phone required" });

    const existing = await User.findUserByMobile(newPhone);
    if (existing) return res.status(400).json({ message: "Phone already in use" });

    const otp = Math.floor(100000 + Math.random() * 900000);
    otpChangeStore[req.user.id] = { newPhone, otp };

    await client.messages.create({ from: process.env.TWILIO_WHATSAPP_NUMBER, to: `whatsapp:+91${newPhone}`, body: `Your ZaykaZone OTP for changing number is ${otp}` });

    return res.json({ message: "OTP sent to new number" });
  } catch (err) { 
    console.error("Mobile number change error :- ",err);
    res.status(500).json({message:"Server error"});
  }
};

const verifyOtpChange = async (req, res) => {
  try {
    const userId = req.user.id;
    const { otp } = req.body;

    const pending = otpChangeStore[userId];
    if (!pending) return res.status(400).json({ message: "No pending change request" });

    if (pending.otp != otp) return res.status(400).json({ message: "Invalid OTP" });

    // update mobile
    await db.execute("UPDATE user_info SET mobile = ? WHERE id = ?", [pending.newPhone, userId]);
    delete otpChangeStore[userId];

    // optionally return updated user
    const [rows] = await db.execute("SELECT id, name, email, mobile, user_pic FROM user_info WHERE id = ?", [userId]);
    return res.json({ message: "Phone updated", user: rows[0] });
  } catch (err) { 
     console.error("Mobile otp change verify error :- ",err);
    res.status(500).json({message:"Server error"});
  }
};


module.exports= {sendOtp,verifyOtp,updateUser,sendOtpChange,verifyOtpChange} ;
