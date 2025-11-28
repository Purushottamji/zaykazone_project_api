const twilio=require("twilio");
const dotenv=require("dotenv");
dotenv.config();
const client= twilio(process.env.TWILIO_SID,process.env.TWILIO_AUTH);

const otpStore={};

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


const verifyOtp=(req,res)=>{
    const {phone,otp}=req.body;

    if(!phone || !otp) return res.status(400).json({message:"Phonr and OTP are required"});

    if(otpStore[phone] ==otp) {
        delete otpStore[phone];
        return res.status(200).json({message:"OTP verified"});
    }
    res.status(400).json({message:"Invalid OTP"});
};

module.exports={sendOtp,verifyOtp};
