const Address = require("../models/addModel");

const createAddress= async(req, res) =>{
    try{
        const {user_id,label_as,full_address,street,pin_code,apartment_no,building_no}=req.body;
        if(!user_id || !full_address)
             return res.status(400).json({message:"User ID and Full Address is required"});
        const {insertId}= await Address.createAddress({
            user_id, label_as, full_address, street, pin_code, apartment_no, building_no
        });
        res.status(201).json({message:"Address added",add_id:insertId});

    }catch(err){
        console.error("Error adding address: ",err);
        res.status(500).json({message:"Server error"+err});
    }
};

const getUserAddress= async (req, res)=>{
    try{
        const {user_id} =req.params;
        const addresses= await Address.getAddressByUserId(user_id);
        res.status(200).json({data:addresses})
    }catch(err){
        res.status(500).json({message:"Server error"});
    }
};

const updateAddress = async (req, res) =>{
    try{
        const {add_id} =req.params;
        const updated= await Address.updateAddress(add_id,req.body);

        if(!updated) return res.status(404).json({message:"Address not found"});
        res.status(200).json({message:"Address updated"});
    }catch(err){
        res.status(500).json({message:"Server error"})
    }
};


const deleteAddress=async (req,res)=>{
    try{
        const {add_id} =req.params;
        const deleted=await Address.deleteAddress(add_id);
        if(!deleted) return res.status(404).json({message:"Address not found"});
        res.status(200).json({message:"Address deleted"});
    }catch(err){
        res.status(500).json({message:"Server error"});
    }
};

module.exports= {createAddress, getUserAddress, updateAddress, deleteAddress};