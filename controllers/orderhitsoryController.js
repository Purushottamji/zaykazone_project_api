const db = require("../db");

const orderHistoryGet=async (req,res)=>{

    try{
         
    

    const user_id=req.params.user_id;
    const [rows]=await db.query("SELECT * FROM orderHistory WHERE user_id=?",[user_id]);

    res.status(200).json(rows); 
    }catch(error){
        res.status(500).json({message:"database fetching error: "+error});

    }


}


const orderHistoryPost = async (req, res) => {
  try {
    

    const {
      user_id,
      p_o_a_id,
      res_id,
      food_id,
      food_name,
      quantity,
      total_price
    } = req.body;

    const insertQuery = `
      INSERT INTO orderHistory 
      (user_id, p_o_a_id, res_id, food_id, food_name, quantity, total_price)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      user_id,
      p_o_a_id,
      res_id,
      food_id,
      food_name,
      quantity,
      total_price
    ];

    const [result] = await db.query(insertQuery, values);

    res.status(201).json({
      message: "Order history added successfully",
      insertId: result.insertId
    });

  } catch (error) {
    res.status(500).json({
      message: "Database fetching error",
      error: error.message
    });
  }
};




    module.exports={orderHistoryGet,orderHistoryPost};


