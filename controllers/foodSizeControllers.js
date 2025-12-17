const db = require("../db");

const getFoodSize= async (req,res) =>{
    try{
        const sql=`SELECT * FROM food_sizes`;
        const [row] = await db.execute(sql);
        res.status(200).json({message:"Food size fetched",foodSize:row});
    }catch(err){
        console.error("Food size fetching error :",err);
        res.status(500).json({message:"Server Error"});
    }
}

const addFoodSize = async (req, res) => {
  try {
    const { food_id, size, extra_price } = req.body;

    if (!food_id || !size) {
      return res.status(400).json({
        message: "food_id and size are required",
      });
    }

    const price = Number(extra_price) || 0;

    const [food] = await db.execute(
      "SELECT id FROM food_details WHERE id = ?",
      [food_id]
    );

    if (food.length === 0) {
      return res.status(404).json({
        message: "Food not found",
      });
    }

    // ✅ Prevent duplicate size
    const [existing] = await db.execute(
      "SELECT id FROM food_sizes WHERE food_id = ? AND size = ?",
      [food_id, size]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        message: "Size already exists for this food",
      });
    }

    const sql = `
      INSERT INTO food_sizes (food_id, size, extra_price)
      VALUES (?, ?, ?)
    `;

    const [result] = await db.execute(sql, [
      food_id,
      size,
      price,
    ]);

    return res.status(201).json({
      message: "Food size added successfully",
      foodSizeId: result,
    });

  } catch (err) {
    console.error("Adding Food Size error:", err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = { addFoodSize , getFoodSize};
