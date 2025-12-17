const db=require("../db");

const getFoodIngredients = async (req,res) =>{
    try{
        const sql=`SELECT * FROM food_ingredients`;
        const [row] = await db.execute(sql);
        res.status(200).json({message:"Food ingredients fetched",foodSize:row});
    }catch(err){
        console.error("Food ingredients fetching error :",err);
        res.status(500).json({message:"Server Error"});
    }
}

const addFoodIngredients = async (req,res) =>{
    try{
        const {food_id,ingredient} =req.body;
        if (!food_id || !ingredient) {
              return res.status(400).json({
                message: "food_id and ingredients are required",
              });
            }
        
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
              "SELECT id FROM food_ingredients WHERE food_id = ? AND ingredient = ?",
              [food_id, ingredient]
            );
        
            if (existing.length > 0) {
              return res.status(409).json({
                message: "Ingredients already exists for this food",
              });
            }
        
            const sql = `
              INSERT INTO food_ingredients (food_id, ingredient)
              VALUES (?, ?)
            `;
        
            const [result] = await db.execute(sql, [
              food_id,
              ingredient
            ]);
        
            return res.status(201).json({
              message: "Food ingredients added successfully",
              foodSizeId: result,
            });
    }catch(err){
        console.error("Adding Food ingredients error :", err);
        res.status(500).json({message:"Server Error"});
    }
}
const patchFoodIngredients = async (req, res) => {
  try {
    const { id } = req.params;
    const { food_id, ingredient } = req.body;

    if (!id) {
      return res.status(400).json({
        message: "Ingredient id is required",
      });
    }

    const [existing] = await db.execute(
      "SELECT id FROM food_ingredients WHERE id = ?",
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        message: "Ingredient not found",
      });
    }

    const fields = [];
    const values = [];

    if (food_id) {
      fields.push("food_id = ?");
      values.push(food_id);
    }

    if (ingredient) {
      fields.push("ingredient = ?");
      values.push(ingredient);
    }

    if (fields.length === 0) {
      return res.status(400).json({
        message: "No fields provided to update",
      });
    }

    const sql = `
      UPDATE food_ingredients
      SET ${fields.join(", ")}
      WHERE id = ?
    `;

    values.push(id);

    await db.execute(sql, values);

    res.status(200).json({
      message: "Food ingredient updated successfully",
    });

  } catch (err) {
    console.error("Patching Food Ingredients Error:", err);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports={addFoodIngredients,getFoodIngredients,patchFoodIngredients};