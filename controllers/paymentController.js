const db=require("../db");

const getPaymentByUserId=async (req, res) => {
  try {
    const viewQuery = "SELECT * FROM payment WHERE user_id = ?";
    const [rows] = await database.query(viewQuery); 
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: "server error: " + error });
  }
}

const addPaymentDetails=async (req, res) => {
  try {
    const { user_id, card_holder_name, card_number, exp_date, cvv } = req.body;

    const insertQuery = "INSERT INTO payment (user_id, card_holder_name, card_number, exp_date, cvv) VALUES (?, ?, ?, ?, ?)";

    const values = [user_id, card_holder_name, card_number, exp_date, cvv];

    const [result] = await database.query(insertQuery, values);

    res.status(201).json({
    
    user_id,card_holder_name,card_number,exp_date,cvv
    });

  } catch (error) {
    
   return res.status(500).json({ message: "Server Error: " + error });
  }
}


module.exports={getPaymentByUserId,addPaymentDetails};