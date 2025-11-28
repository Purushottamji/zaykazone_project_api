const db = require("../db");



const createAddress= async ({user_id, label_as, full_address, street, pin_code, apartment_no, building_no})=>{
    const sql=`INSERT INTO user_address(user_id, label_as, full_address, street, pin_code, apartment_no, building_no) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const [result]=await db.execute(sql,[user_id, label_as, full_address, street, pin_code, apartment_no, building_no]);
    return {insertId: result.insertId};
};

const getAddressByUserId=async (user_id)=>{
    const sql=`SELECT * FROM user_address WHERE user_id = ?`;
    const [rows] = await db.execute(sql,[user_id]);
    return rows;
};

const updateAddress = async(add_id,{label_as, full_address, street, pin_code, apartment_no, building_no})=>{
    const sql=`UPDATE user_address SET label_as = ? , full_address = ?, street = ?, pin_code = ?, apartment_no = ?, building_no = ? WHERE add_id = ?`;
    const [result]= await db.execute(sql,[label_as, full_address, street, pin_code, apartment_no, building_no, add_id]);
    return result.affectedRows > 0;
};

const deleteAddress= async (add_id)=>{
    const sql=`DELETE FROM user_address WHERE add_id = ?`;
    const [result] = await db.execute(sql,[add_id]);
    return result.affectedRows > 0;
};

module.exports={createAddress,getAddressByUserId,updateAddress,deleteAddress};