const db=require("../db");


const getOrderByUserId= async (user_id) => {
    const sql=`SELECT * FROM orders WHERE user_id = ?`;
    const [row] =await db.execute(sql,[user_id]);
    return row;
}

const addOrderDetails= async ({res_id,food_name,quantity,total_price,user_id,p_o_a_id}) =>{
    const sql=`INSERT INTO orders(user_id, res_id, food_name, quantity, total_price, p_o_a_id) VALUES (?, ?, ?, ?, ?, ?)`;
    const [result]=await db.execute(sql,[user_id, res_id, food_name, quantity, total_price, p_o_a_id]);
    return {insertId:result.insertId};
}

module.exports={getOrderByUserId, addOrderDetails};