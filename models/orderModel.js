const db=require("../db");


const getOrderByUserId= async (user_id) => {
    const sql=`SELECT * FROM orders WHERE user_id = ?`;
    const [row] =await db.execute(sql,[user_id]);
    return row;
}

const addOrderDetails = async ({
  res_id,
  food_name,
  quantity,
  total_price,
  user_id,
  p_o_a_id
}) => {

  const insertSql = `
    INSERT INTO orders(user_id, res_id, food_name, quantity, total_price, p_o_a_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const [result] = await db.execute(insertSql, [
    user_id,
    res_id,
    food_name,
    quantity,
    total_price,
    p_o_a_id
  ]);

  const orderId = result.insertId;

  const joinSql = `
    SELECT 
      o.order_id AS order_id,
      o.food_name,
      o.quantity,
      o.total_price,

      u.id AS user_id,
      u.name AS user_name,
      u.email,
      u.mobile,

      r.res_id AS restaurant_id,
      r.name AS restaurant_name,
      r.image_url,

      p.full_address,
      p.district,
      p.pincode

    FROM orders o
    JOIN user_info u ON o.user_id = u.id
    JOIN restaurant_details r ON o.res_id = r.res_id
    JOIN placeorderAddress p ON o.p_o_a_id = p.id
    WHERE o.id = ?
  `;

  const [rows] = await db.execute(joinSql, [orderId]);

  return rows[0];
};

module.exports={getOrderByUserId, addOrderDetails};